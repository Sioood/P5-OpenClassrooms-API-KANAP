// ForEach product / color -> fecth info with id
// get the price and the rest of info and write into DOM

let cart = JSON.parse(localStorage.getItem("Cart"));

// sort the cart for group the same color together
cart.sort(function compare(a, b) {
  if (a.id > b.id) return 1;
  if (a.colors > b.colors) return 1;
});

// separate id into an array for the POST

function getId() {
  let idArray = [];

  for (let i = 0; i < cart.length; i++) {
    idArray.push(cart[i].id);
  }

  return idArray;
}
//Integrate in DOM

// set loop for fetch each product in the cart
function initInsert() {
  // set sum for calculate after
  let sumPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    function fetchJsonProduct() {
      fetch(`http://localhost:3000/api/products/${cart[i].id}`)
        .then(function (getProducts) {
          return getProducts.json();
        })
        .then((info) => {
          // Integration in DOM
          function initDOM() {
            const cartDisplay = document.getElementById("cart__items");

            const article = document.createElement("article");
            article.setAttribute("class", "cart__item");
            article.setAttribute("data-id", `${cart[i].id}`);
            article.setAttribute("data-color", `${cart[i].colors}`);
            cartDisplay.appendChild(article);

            // img

            const wrapperImg = document.createElement("div");
            wrapperImg.setAttribute("class", "cart__item__img");
            article.appendChild(wrapperImg);

            const img = document.createElement("img");
            img.setAttribute("src", `${info.imageUrl}`);
            img.setAttribute("alt", `${info.altTxt}`);
            wrapperImg.appendChild(img);

            // content

            const wrapperContent = document.createElement("div");
            wrapperContent.setAttribute("class", "cart__item__content");
            article.appendChild(wrapperContent);

            // description

            const contentDescription = document.createElement("div");
            contentDescription.setAttribute(
              "class",
              "cart__item__content__description"
            );
            wrapperContent.appendChild(contentDescription);

            const descriptionTitle = document.createElement("h2");
            descriptionTitle.innerText = `${info.name}`;
            contentDescription.appendChild(descriptionTitle);

            const descriptionColors = document.createElement("p");
            descriptionColors.innerText = `${cart[i].colors}`;
            contentDescription.appendChild(descriptionColors);

            const descriptionPrice = document.createElement("p");
            descriptionPrice.innerText = `${info.price} €`;
            contentDescription.appendChild(descriptionPrice);

            // settings

            const contentSettings = document.createElement("div");
            contentSettings.setAttribute(
              "class",
              "cart__item__content__settings"
            );
            wrapperContent.appendChild(contentSettings);

            // quantity

            const settingsQuantity = document.createElement("div");
            settingsQuantity.setAttribute(
              "class",
              "cart__item__content__settings__quantity"
            );
            contentSettings.appendChild(settingsQuantity);

            const quantityParagraph = document.createElement("p");
            quantityParagraph.innerText = "Qté : ";
            settingsQuantity.appendChild(quantityParagraph);

            const quantity = document.createElement("input");
            quantity.setAttribute("type", "number");
            quantity.setAttribute("class", "itemQuantity");
            quantity.setAttribute("name", "itemQuantity");
            quantity.setAttribute("min", "1");
            quantity.setAttribute("max", "100");
            quantity.setAttribute("value", `${cart[i].quantity}`);
            settingsQuantity.appendChild(quantity);

            // delete

            const settingsDelete = document.createElement("div");
            settingsDelete.setAttribute(
              "class",
              "cart__item__content__settings__delete"
            );
            contentSettings.appendChild(settingsDelete);

            const deleteParagraph = document.createElement("p");
            deleteParagraph.setAttribute("class", "deleteItem");
            deleteParagraph.innerText = "Supprimer";
            settingsDelete.appendChild(deleteParagraph);
          }
          initDOM();

          // set total quantity and price

          const DOMQuantity = document.getElementById("totalQuantity");

          // separate functions for calculate total
          // base function for the loading setup and the modification
          function checkout() {
            //Total quantity

            //reduce for calculate the total of object quantity a,b -> a + b just addition
            const totalQuantity = Object.values(cart).reduce(
              (accumulateur, { quantity }) => accumulateur + quantity,
              0
            );

            // set 0 if cart is empty
            if (cart.length != 0) {
              DOMQuantity.innerHTML = `${totalQuantity}`;
            } else {
              sumPrice = 0;
              DOMQuantity.innerHTML = "0";
            }

            // Total Price

            const DOMPrice = document.getElementById("totalPrice");
            const totalPrice = sumPrice;
            DOMPrice.innerHTML = `${totalPrice}`;
          }

          // set the total with the fetch at loading
          function setCheckout() {
            if (cart.length != 0) {
              sumPrice = sumPrice + info.price * cart[i].quantity;
              DOMQuantity.innerHTML = `${totalQuantity}`;
            }
            checkout();
          }
          setCheckout();

          // function at modification, refectch each id of product and get price
          function modifyCheckout() {
            if (cart.length != 0) {
              sumPrice = 0;
              for (let i = 0; i < cart.length; i++) {
                async function fetchJsonProduct() {
                  const response = await fetch(
                    `http://localhost:3000/api/products/${cart[i].id}`
                  );
                  return await response.json();
                }

                // recalculate global quantities and prices
                fetchJsonProduct().then((info) => {
                  sumPrice = sumPrice + info.price * cart[i].quantity;

                  if (i == cart.length - 1) {
                    checkout();
                  }
                });
              }
            } else {
              sumPrice = 0;
              checkout();
            }
          }

          // get out the loop

          if (i == cart.length - 1) {
            // Function for modify item in the DOM & the localStorage

            // get html collection and transform into an array
            let getQuantityInputs =
              document.getElementsByClassName("itemQuantity");
            let quantityInputs = [...getQuantityInputs];

            quantityInputs.forEach((quantityInput) => {
              quantityInput.addEventListener("change", () => {
                const input = quantityInput.closest(".cart__item");
                checkProduct();

                // check the index of the product which want a modification
                async function checkProduct() {
                  const id = await input.dataset.id;
                  const color = await input.dataset.color;

                  for (let cartValue of cart) {
                    const index = cart.findIndex(
                      (cartElement) =>
                        cartElement.id === `${id}` &&
                        cartElement.colors === `${color}`
                    );

                    // check the index and modify the right one in the localStorage
                    if (cartValue.id === id && cartValue.colors === color) {
                      cart[index].quantity = Number(quantityInput.value);

                      modifyCheckout();

                      localStorage.setItem("Cart", JSON.stringify(cart));
                    }
                  }
                }
              });
            });

            // Function for delete item in the DOM & the localStorage

            // get html collection and transform into an array
            let getDeleteInputs = document.getElementsByClassName("deleteItem");
            let deleteInputs = [...getDeleteInputs];

            deleteInputs.forEach((deleteInput) => {
              deleteInput.addEventListener("click", () => {
                const input = deleteInput.closest(".cart__item");

                checkProduct();

                // check the index of the product which want a modification
                async function checkProduct() {
                  const id = await input.dataset.id;
                  const color = await input.dataset.color;

                  for (let cartValue of cart) {
                    const index = cart.findIndex(
                      (cartElement) =>
                        cartElement.id === `${id}` &&
                        cartElement.colors === `${color}`
                    );

                    // check the index and modify the right one in the localStorage
                    if (cartValue.id === id && cartValue.colors === color) {
                      cart.splice(index, 1);

                      getId();

                      localStorage.setItem("Cart", JSON.stringify(cart));
                      input.remove();

                      if (cart.length == 0) {
                        localStorage.removeItem("Cart");
                      }

                      modifyCheckout();
                    }
                  }
                }
              });
            });
          }
        });
    }
    fetchJsonProduct();
  }
}
initInsert();

// regex form
// for the next step(fetch POST) make a extra validation for block the validation if we have an error

const regxTxt = /(\d|\s|[-_,])/g;

const regxAddress = /([0-9]+)\s([a-zA-Z]+)/g;

const regxMail = /([a-zA-Z0-9-_\.]{5,})@([a-zA-Z]+)\.([a-zA-Z]{2,9})/;

// verify if the form is good and respect regex

let validator = false;

let orderButton = document.getElementById("order");

function verify() {
  if (validator == true) {
    orderButton.removeAttribute("disabled");
  } else {
    orderButton.setAttribute("disabled", true);
  }
}

// set true when empty because required is enable and notify required input if submit

function setTrue() {
  validator = true;
  verify();
}

function setFalse() {
  validator = false;
  verify();
}

function regxIf() {
  if (
    firstNameInput.value.length != 0 &&
    lastNameInput.value.length != 0 &&
    cityInput.value.length != 0 &&
    addressInput.value.length != 0 &&
    emailInput.value.length != 0
  ) {
    return (
      !firstNameInput.value.match(regxTxt) &&
      !lastNameInput.value.match(regxTxt) &&
      !cityInput.value.match(regxTxt) &&
      addressInput.value.match(regxAddress) &&
      emailInput.value.match(regxMail)
    );
  }
}

const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const cityInput = document.getElementById("city");
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");

function formListener() {
  firstNameInput.addEventListener("input", () => {
    regexFirstName();
  });

  lastNameInput.addEventListener("input", () => {
    regexLastName();
  });

  cityInput.addEventListener("input", () => {
    regexCity();
  });

  addressInput.addEventListener("input", () => {
    regexAddress();
  });

  emailInput.addEventListener("input", () => {
    regexEmail();
  });
}
formListener();

// Only text regex

function regexFirstName() {
  if (!firstNameInput.value.length == 0) {
    if (firstNameInput.value.match(regxTxt)) {
      document.getElementById(
        "firstNameErrorMsg"
      ).innerHTML = `${firstNameInput.value} n'est pas valide veuillez ne mettre que des lettres.`;
      setFalse();
    } else if (regxIf()) {
      document.getElementById("firstNameErrorMsg").innerHTML = "";
      setTrue();
    } else {
      document.getElementById("firstNameErrorMsg").innerHTML = "";
    }
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = "";
    setFalse();
  }
}

function regexLastName() {
  if (!lastNameInput.value.length == 0) {
    if (lastNameInput.value.match(regxTxt)) {
      document.getElementById(
        "lastNameErrorMsg"
      ).innerHTML = `${lastNameInput.value} n'est pas valide veuillez ne mettre que des lettres.`;
      setFalse();
    } else if (regxIf()) {
      document.getElementById("lastNameErrorMsg").innerHTML = "";
      setTrue();
    } else {
      document.getElementById("lastNameErrorMsg").innerHTML = "";
    }
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
    setFalse();
  }
}

function regexCity() {
  if (!cityInput.value.length == 0) {
    if (cityInput.value.match(regxTxt)) {
      document.getElementById(
        "cityErrorMsg"
      ).innerHTML = `${cityInput.value} n'est pas valide veuillez ne mettre que des lettres.`;
      setFalse();
    } else if (regxIf()) {
      document.getElementById("cityErrorMsg").innerHTML = "";
      setTrue();
    } else {
      document.getElementById("cityErrorMsg").innerHTML = "";
    }
  } else {
    document.getElementById("cityErrorMsg").innerHTML = "";
    setFalse();
  }
}

// regex address

function regexAddress() {
  if (!addressInput.value.length == 0) {
    if (!addressInput.value.match(regxAddress)) {
      document.getElementById(
        "addressErrorMsg"
      ).innerHTML = `${addressInput.value} n'est pas valide veuillez rentrer une adresse valide. (6 rue de...)`;
      setFalse();
    } else if (regxIf()) {
      document.getElementById("addressErrorMsg").innerHTML = "";
      setTrue();
    } else {
      document.getElementById("addressErrorMsg").innerHTML = "";
    }
  } else {
    document.getElementById("addressErrorMsg").innerHTML = "";
    setFalse();
  }
}

// regex mail

function regexEmail() {
  if (!emailInput.value.length == 0) {
    if (!emailInput.value.match(regxMail)) {
      document.getElementById(
        "emailErrorMsg"
      ).innerHTML = `${emailInput.value} n'est pas valide veuillez rentrer une adresse email valide. (exemple@email.com)`;
      setFalse();
    } else if (regxIf()) {
      document.getElementById("emailErrorMsg").innerHTML = "";
      setTrue();
    } else {
      document.getElementById("emailErrorMsg").innerHTML = "";
    }
  } else {
    document.getElementById("emailErrorMsg").innerHTML = "";
    setFalse();
  }
}

// fetch POST the form after verification

orderButton.addEventListener("click", () => {
  if (validator === true) {
    order();
  }
});

function order() {
  // make and object and get the array of id we have setup earlier
  let form = {
    products: getId(),
    //object contact
    contact: {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      address: addressInput.value,
      city: cityInput.value,
      email: emailInput.value,
    },
  };

  // fetch POST the form
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  })
    .then((response) => response.json())

    // redirect to confirmation with id
    .then((orderId) => {
      document.location.href = `./confirmation.html?orderid=${orderId.orderId}`;
    });
}

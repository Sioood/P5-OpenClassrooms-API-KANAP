// ForEach product / color -> fecth info with id
// get the price and the rest of info and write into DOM

let cart = JSON.parse(localStorage.getItem("Cart"));

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

let sumPrice = 0;

//Integrate in DOM

for (let i = 0; i < cart.length; i++) {
  async function fetchJsonProduct() {
    const response = await fetch(
      `http://localhost:3000/api/products/${cart[i].id}`
    );
    return await response.json();
  }

  // integration products & total of price - quantity

  function insert() {
    fetchJsonProduct().then((info) => {
      const cartDisplay = document.getElementById("cart__items");

      cartDisplay.insertAdjacentHTML(
        "beforeend",

        `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].colors}">
                  <div class="cart__item__img">
                    <img src="${info.imageUrl}" alt="${info.altTxt}">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${info.name}</h2>
                      <p>${cart[i].colors}</p>
                      <p>${info.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
                </article>`
      );

      // set total quantity and price

      const DOMQuantity = document.getElementById("totalQuantity");

      function setCheckout() {
        if (cart.length != 0) {
          sumPrice = sumPrice + info.price * cart[i].quantity;
          DOMQuantity.innerHTML = `${totalQuantity}`;
        }
        checkout();
      }
      setCheckout();

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

            fetchJsonProduct().then((info) => {
              sumPrice = sumPrice + info.price * cart[i].quantity;

              if (i == cart.length - 1) {
                checkout();
              }
            });
          }
        }
      }

      function checkout() {
        //Total quantity

        const totalQuantity = Object.values(cart).reduce(
          (accumulateur, { quantity }) => accumulateur + quantity,
          0
        );

        if (cart.length != 0) {
          DOMQuantity.innerHTML = `${totalQuantity}`;
        } else {
          sumPrice = 0;
          DOMQuantity.innerHTML = "0";
        }

        //Total Price

        const DOMPrice = document.getElementById("totalPrice");
        const totalPrice = sumPrice;
        DOMPrice.innerHTML = `${totalPrice}`;
      }

      // get out the loop

      if (i == cart.length - 1) {
        // Function for modify item in the DOM & the localStorage

        let getQuantityInputs = document.getElementsByClassName("itemQuantity");
        let quantityInputs = [...getQuantityInputs];

        quantityInputs.forEach((quantityInput) => {
          quantityInput.addEventListener("change", () => {
            const input = quantityInput.closest(".cart__item");
            checkProduct();
            async function checkProduct() {
              const id = await input.dataset.id;
              const color = await input.dataset.color;

              for (let cartValue of cart) {
                const index = cart.findIndex(
                  (cartElement) =>
                    cartElement.id === `${id}` &&
                    cartElement.colors === `${color}`
                );
                if (cartValue.id === id && cartValue.colors === color) {
                  cart[index].quantity = Number(quantityInput.value);

                  modifyCheckout();

                  localStorage.setItem("Cart", JSON.stringify(cart));

                  setTimeout(() => {
                    // alert(`You have modified this item`);
                  }, 3);
                }
              }
            }
          });
        });

        // Function for delete item in the DOM & the localStorage

        let getDeleteInputs = document.getElementsByClassName("deleteItem");
        let deleteInputs = [...getDeleteInputs];

        deleteInputs.forEach((deleteInput) => {
          deleteInput.addEventListener("click", () => {
            const input = deleteInput.closest(".cart__item");

            checkProduct();
            async function checkProduct() {
              const id = await input.dataset.id;
              const color = await input.dataset.color;

              for (let cartValue of cart) {
                const index = cart.findIndex(
                  (cartElement) =>
                    cartElement.id === `${id}` &&
                    cartElement.colors === `${color}`
                );
                if (cartValue.id === id && cartValue.colors === color) {
                  cart.splice(index, 1);

                  getId();

                  localStorage.setItem("Cart", JSON.stringify(cart));
                  input.remove();

                  if (cart.length == 0) {
                    localStorage.removeItem("Cart");
                  }

                  modifyCheckout();

                  setTimeout(() => {
                    alert(`You have deleted this item`);
                  }, 3);
                }
              }
            }
          });
        });
      }
    });
  }
  insert();
}

// regex form
// for the next step(fetch POST) make a extra validation for block the validation if we have an error

let regxTxt = /\d|\s|[-_,]/g;

let regxAddress = /([0-9]+)\s([a-zA-Z]+)/g;

let regxMail = /([a-zA-Z0-9-_\.]{5,})@([a-zA-Z]+)\.([a-zA-Z]{2,9})/;

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
  return (
    !lastNameInput.value.match(regxTxt) &&
    !lastNameInput.value.match(regxTxt) &&
    !cityInput.value.match(regxTxt) &&
    addressInput.value.match(regxAddress) &&
    emailInput.value.match(regxMail)
  );
}

// Only text regex

const firstNameInput = document.getElementById("firstName");

firstNameInput.addEventListener("input", () => {
  if (!firstNameInput.value.length == 0) {
    if (firstNameInput.value.match(regxTxt)) {
      document.getElementById("firstNameErrorMsg").innerHTML = "ERROR";
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
});

const lastNameInput = document.getElementById("lastName");

lastNameInput.addEventListener("input", () => {
  if (!lastNameInput.value.length == 0) {
    if (lastNameInput.value.match(regxTxt)) {
      document.getElementById("lastNameErrorMsg").innerHTML = "ERROR";
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
});

const cityInput = document.getElementById("city");

cityInput.addEventListener("input", () => {
  if (!cityInput.value.length == 0) {
    if (cityInput.value.match(regxTxt)) {
      document.getElementById("cityErrorMsg").innerHTML = "ERROR";
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
});

// regex address

const addressInput = document.getElementById("address");

addressInput.addEventListener("input", () => {
  if (!addressInput.value.length == 0) {
    if (!addressInput.value.match(regxAddress)) {
      document.getElementById("addressErrorMsg").innerHTML = "ERROR";
      setFalse();
    } else if (regxIf()) {
      document.getElementById("addressErrorMsg").innerHTML = "";
      setTrue();
    } else {
      document.getElementById("addressErrorMsg").innerHTML = "";
    }
    console.log(validator);
  } else {
    document.getElementById("addressErrorMsg").innerHTML = "";
    setFalse();
  }
});

// regex mail

const emailInput = document.getElementById("email");

emailInput.addEventListener("input", () => {
  if (!emailInput.value.length == 0) {
    if (!emailInput.value.match(regxMail)) {
      document.getElementById("emailErrorMsg").innerHTML = "ERROR";
      setFalse();
    } else if (regxIf()) {
      document.getElementById("emailErrorMsg").innerHTML = "";
      setTrue();
    } else {
      document.getElementById("emailErrorMsg").innerHTML = "";
    }
    console.log(validator);
  } else {
    document.getElementById("emailErrorMsg").innerHTML = "";
    setFalse();
  }
});

//fetch POST the form after verification

orderButton.addEventListener("click", () => {
  if (validator === true) {
    order();
  }
});

function order() {
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

  console.log(JSON.stringify(form));

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  })
    .then((response) => response.json())

    // Displaying results to console
    .then((orderId) => {
      document.location.href = `./confirmation.html?orderid=${orderId.orderId}`;
    });
}

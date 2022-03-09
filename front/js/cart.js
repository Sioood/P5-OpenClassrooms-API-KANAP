// ForEach product / color -> fecth info with id
// get the price and the rest of info and write into DOM

let cart = JSON.parse(localStorage.getItem("Cart"));

cart.sort(function compare(a, b) {
  if (a.id > b.id) return 1;
  if (a.colors > b.colors) return 1;
});

let priceArray = [];

//Integrate in DOM

for (let i = 0; i < cart.length; i++) {
  fetch(`http://localhost:3000/api/products/${cart[i].id}`)
  .then((GetRemainingInfo) => {
    return GetRemainingInfo.json();
  })
  .then((info) => {

    const cartDisplay = document.getElementById("cart__items");

    cartDisplay.insertAdjacentHTML(
      "beforeend",

      `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart.colors}">
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

    priceArray.push(info.price);

  })
}

console.log(priceArray);

//Total quantity

const DOMQuantity = document.getElementById("totalQuantity");
const totalQuantity = Object.values(cart).reduce((acc, {quantity}) => acc + quantity, 0);
DOMQuantity.innerHTML = `${totalQuantity}`;

//Total Price

const DOMPrice = document.getElementById("totalPrice")
const totalPrice = priceArray.reduce((acc, cur) => acc + cur, 0)
DOMPrice.innerHTML = `${totalPrice}`;

//For modifications get onchange the data-element id & color <article> and update the DOM & the localstorage

const inputQuantity = document.getElementsByClassName("itemQuantity");

console.log(inputQuantity);

const deleteButton = document.getElementsByClassName("deleteItem");

console.log(deleteButton);

// regex form

let regxTxt = /\d|\s|[-_,]/g; 

let regxAdresse = /([0-9]+)\s([a-zA-Z]+)/;

let regxMail = /([a-zA-Z0-9-_\.]{5,})@([a-zA-Z]+)\.([a-zA-Z]{2,9})/;

// Only texte regex

const firstNameInput = document.getElementById("firstName");

firstNameInput.addEventListener("change", () => {
  if(!firstNameInput.value.length == 0){
    if (firstNameInput.value.match(regxTxt)){
      document.getElementById("firstNameErrorMsg").innerHTML = "ERROR";
    }
  }
  else{
    document.getElementById("firstNameErrorMsg").innerHTML = "";
  }
})
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

    priceArray.push(info);

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
const test = priceArray.map(x => x);
const test2 = [1849, 1849, 4499]
DOMPrice.innerHTML = `${totalPrice}`;

console.log(totalQuantity , totalPrice, test, test2);

//For modifications get onchange the data-element id & color <article> and update the DOM & the localstorage

// ForEach product / color -> fecth info with id
// get the price and the rest of info and write into DOM

let cart = JSON.parse(localStorage.getItem("Cart"));

cart.sort(function compare(a, b) {
  if (a.id > b.id) return 1;
  if (a.colors > b.colors) return 1;
});

let sumPrice = 0;

//Integrate in DOM

for (let i = 0; i < cart.length; i++) {
  async function fetchJsonProduct() {
    const response = await fetch(
      `http://localhost:3000/api/products/${cart[i].id}`
    );
    return await response.json();
  }

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

      function setCheckout() {
        //Total quantity

        const DOMQuantity = document.getElementById("totalQuantity");
        const totalQuantity = Object.values(cart).reduce(
          (acc, { quantity }) => acc + quantity,
          0
        );
        

        if (cart.length != 0){
          sumPrice = info.price * cart[i].quantity;
          DOMQuantity.innerHTML = `${totalQuantity}`;
        }
        else{
          sumPrice = 0
          DOMQuantity.innerHTML = "0";
        }

        //Total Price

        const DOMPrice = document.getElementById("totalPrice");
        const totalPrice = sumPrice;
        DOMPrice.innerHTML = `${totalPrice}`;
      }
      setCheckout();

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
                  console.log(cart[index].quantity, quantityInput.value);

                  setCheckout();

                  localStorage.setItem("Cart", JSON.stringify(cart));

                  setTimeout(() => {
                    alert(`You have modified this item`);
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
                  console.log(cart);

                  localStorage.setItem("Cart", JSON.stringify(cart));
                  input.remove();

                  if(cart.length == 0){
                    localStorage.removeItem("Cart");
                  }

                  setCheckout();
                  
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

// get the id of product in the url

paramsString = new URL(window.location.href);

let searchParams = new URLSearchParams(paramsString.search);

const id = searchParams.get("id");

// fetch only the product of id

function fecthProduct() {
  fetch(`http://localhost:3000/api/products/${id}`)
    .then(function (getProduct) {
      return getProduct.json();
    })
    .then(function (product) {
      // get all info of the product and integrate into the DOM

      const title = document.getElementsByTagName("title")[0];
      title.innerText = product.name;

      const img = document.getElementsByClassName("item__img")[0];
      img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

      const name = document.getElementById("title");
      name.innerText = product.name;

      const price = document.getElementById("price");
      price.innerText = product.price;

      const description = document.getElementById("description");
      description.innerText = product.description;

      const colorsOption = document.getElementById("colors");
      product.colors.forEach((colors) => {
        colorsOption.insertAdjacentHTML(
          "beforeend",
          `<option value="${colors}">${colors}</option>`
        );
      });

      // don't save the price anywhere

      // Make an object with all info and not the price -> integrate in the cart by fecth and the id

      // button add to cart make a save on the local storage not before

      // if in local storage we have already an id and a color which want select -> modify and not add a new object

      const addToCart = document.getElementById("addToCart");

      addToCart.addEventListener("click", function storage() {
        const colorsSelect = document.getElementById("colors").value;
        const quantity = document.getElementById("quantity").value;

        // Comparaison for only add to cart real product

        if (quantity >= 1 && quantity <= 100 && colorsSelect != 0) {
          //redirect into the cart after addToCart
          document.location.href = "./cart.html";

          // set array and object for each product
          let temporaryCart = [
            {
              quantity: Number(quantity),
              colors: colorsSelect,
              id: product._id,
            },
          ];

          let cart = JSON.parse(localStorage.getItem("Cart"));

          // set local storage when empty and not

          if (localStorage.getItem("Cart")) {
            for (let cartValue of cart) {
              const index = cart.findIndex(
                (cartElement) =>
                  cartElement.id === `${id}` &&
                  cartElement.colors === `${colorsSelect}`
              );

              if (cartValue.id === id && cartValue.colors === colorsSelect) {
                // modify the quantity of existing
                cart[index].quantity =
                  cart[index].quantity + temporaryCart[0].quantity;

                // Set limit of 100 with modify quantities because click the button can overpass the past conditions

                if (cart[index].quantity > 100) {
                  cart[index].quantity = 100;
                }

                localStorage.setItem("Cart", JSON.stringify(cart));

                return;
              } else if (index === -1) {
                //if product don't have index in the cart create an object and push it
                Array.prototype.push.apply(cart, temporaryCart);
                localStorage.setItem("Cart", JSON.stringify(cart));

                return;
              }
            }
          } else {
            //if cart is empty set localStorage item
            localStorage.setItem("Cart", JSON.stringify(temporaryCart));
          }
        }
      });
    });
}

fecthProduct();

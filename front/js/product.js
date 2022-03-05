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

      // button add to cart make a save on the local storage not before

      document
        .getElementById("addToCart")
        .addEventListener("click", function storage() {
          const colorsSelect = document.getElementById("colors").value;
          const quantity = document.getElementById("quantity").value;

          // Comparaison for only add to cart real product

          if( quantity >= 1 && quantity <= 100 && colorsSelect != 0 ){

            // Make an object with all info and not the price -> integrate in the cart by fecth and the id

            let temporaryCart = [{
              quantity: `${quantity}`,
              colors: `${colorsSelect}`,
              id: `${product._id}`,
              name: `${product.name}`,
              imageUrl: `${product.imageUrl}`,
              description: `${product.description}`,
              altTxt: `${product.altTxt}`,
            }];
  
            let cartJSON = localStorage.getItem("Cart");
            let cart = JSON.parse(cartJSON);

            // set local storage when empty and not
  
            if (localStorage.getItem("Cart")) {
              Array.prototype.push.apply(cart, temporaryCart);
              localStorage.setItem("Cart", JSON.stringify(cart));
            } else {
              localStorage.setItem("Cart", JSON.stringify(temporaryCart));
            }
          }

        });
    });
}

fecthProduct();
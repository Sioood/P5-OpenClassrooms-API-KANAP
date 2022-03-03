paramsString = new URL(window.location.href);

console.log(paramsString);

let searchParams = new URLSearchParams(paramsString.search);

const id = searchParams.get("id");

function fecthProduct() {
  fetch(`http://localhost:3000/api/products/${id}`)
  .then( function(getProduct) {
      return getProduct.json();
  })
  .then( function(product) {
    const img = document.getElementsByClassName("item__img")
    img[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`

    const title = document.getElementById("title")
    title.innerText = product.name

    const price = document.getElementById("price")
    price.innerText = product.price

    const description = document.getElementById("description")
    description.innerText = product.description

    product.colors.forEach(colors => {

      const colorsOption = document.getElementById("colors")
      colorsOption.insertAdjacentHTML( "beforeend" , `<option value="${colors}">${colors}</option>`)

    });
  })
}

fecthProduct()
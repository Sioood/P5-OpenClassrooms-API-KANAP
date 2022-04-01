// global fetch of products

function fetchAllProducts() {
  fetch("http://localhost:3000/api/products/")
    .then(function (getProducts) {
      return getProducts.json();
    })
    .then(function (products) {
      // ForEach Loop which can get any data of product -> write in DOM

      products.forEach((product) => {
        const items = document.getElementById("items");

        const anchor = document.createElement("a");
        anchor.setAttribute("href", `./product.html?id=${product._id}`);
        items.appendChild(anchor);

        const article = document.createElement("article");
        anchor.appendChild(article);

        const img = document.createElement("img");
        img.setAttribute("src", `${product.imageUrl}`);
        img.setAttribute("alt", `${product.altTxt}`);
        article.appendChild(img);

        const title = document.createElement("h3");
        title.setAttribute("class", "productName");
        title.innerText = `${product.name}`;
        article.appendChild(title);

        const paragraph = document.createElement("p");
        paragraph.setAttribute("class", "productDescription")
        paragraph.innerText = `${product.description}`;
        article.appendChild(paragraph);
      });
    });
}

fetchAllProducts();

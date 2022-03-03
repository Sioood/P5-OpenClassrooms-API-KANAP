// global fetch of products

function fetchAllProducts() {
  fetch("http://localhost:3000/api/products/")
    .then( function(getProducts){
      return getProducts.json();
    }
  )
  .then( function(products) {
    console.log(products);

  // For Loop which can get any data of product -> write in DOM

  // for ( i = 0; i < products.length; i++) {
  //   const items = document.getElementById("items")

  //   items.insertAdjacentHTML( "afterbegin" , `<a href="./product.html?id="${products[i]._id}">
  //   <article>
  //     <img src=".../${products[i].imageUrl}" alt="${products[i].altTxt}">
  //     <h3 class="productName">${products[i].name}</h3>
  //     <p class="productDescription">${products[i].description}</p>
  //   </article>
  // </a>`)
  // }


  // ForEach Loop which can get any data of product -> write in DOM

    products.forEach(product => {
      console.log(product._id , product.name);

      const items = document.getElementById("items")

      items.insertAdjacentHTML( "beforeend" , `<a href="./product.html?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>`)
    });
  })
}

fetchAllProducts()

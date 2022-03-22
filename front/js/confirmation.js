paramsString = new URL(window.location.href);

let searchParams = new URLSearchParams(paramsString.search);

const urlId = searchParams.get("orderid");

const orderId = document.getElementById("orderId");

orderId.innerHTML = `${urlId}`
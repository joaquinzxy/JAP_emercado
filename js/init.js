const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Función que redirecciona a la página de Login
function gotoLogin() {
  location.replace("login.html");
}

//Función que limpia el localStorage, cerrando la sesión y actualizando
function cerrarSesion() {
  localStorage.removeItem("userSesion");
  localStorage.removeItem("localCart");


  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('Sesión de google cerrada');
  });

  location.reload()
}


function addToCart(id){
  let localCart = JSON.parse(localStorage.getItem("localCart"))
  let itemExist = false
  localCart.forEach(item => {
      if(item.name==productsArray[id].name){
          item.count = parseInt(item.count)
          item.count += 1
          itemExist = true;
          localStorage.setItem("localCart", JSON.stringify(localCart))
          cartCounter(localCart.map(item=>item.count).reduce((count, unitCount)=>count+unitCount, 0))
      }
  });
  if(!itemExist){
      let cartItem = {
          "name": productsArray[id].name,
          "count": 1,
          "unitCost": productsArray[id].cost,
          "currency": productsArray[id].currency,
          "src": productsArray[id].imgSrc
      }
      localCart.push(cartItem)
      localStorage.setItem("localCart", JSON.stringify(localCart))
      cartCounter(localCart.map(item=>item.count).reduce((count, unitCount)=>count+unitCount, 0))

  }

}

let productsArray = []

function cartCounter(count){
  count>0 ? document.getElementById("cart-counter").innerHTML = count : document.getElementById("cart-counter").innerHTML = ""
}

document.addEventListener("DOMContentLoaded", function (e) {

  if (!localStorage.getItem("newReviews")) {
    localStorage.setItem("newReviews", "[]")
  } 

    getJSONData(CART_INFO_URL).then(function (resultObj) {
      if (resultObj.status === "ok") {
        if (!localStorage.getItem("localCart")) {
          let cartData = resultObj.data.articles;
          localStorage.setItem("localCart", JSON.stringify(cartData))
          let cartCount = cartData.map(item=>item.count).reduce((count, unitCount)=>count+unitCount, 0)
          cartCounter(cartCount)
        } else {
          let cartData = JSON.parse(localStorage.getItem("localCart"))
          let cartCount = cartData.map(item=>item.count).reduce((count, unitCount)=>count+unitCount, 0)
          cartCounter(cartCount)
        }
      }
    });

    getJSONData(PRODUCTS_URL).then(function (resultObj) {
      if (resultObj.status === "ok") {
        productsArray = resultObj.data;
      }
    });

  if (localStorage.getItem("userSesion") != null) {
    document.getElementById("userPlaceholder").innerHTML = `
    <span class="text-light text-center">Hola 
      <a class="text-info" href="my-profile.html">${JSON.parse(localStorage.getItem("userSesion")).user}</a>
    </span>`
  } else if (!location.href.includes("/login.html")) {
    gotoLogin()
  }



});
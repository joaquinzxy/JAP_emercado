const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Función que redirecciona a la página de Login
function gotoLogin(){
    location.replace("login.html");  
}

//Función que limpia el localStorage, cerrando la sesión y actualizando
function cerrarSesion(){
  localStorage.removeItem("userSesion");

  var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('Sesión de google cerrada');
    });

  location.reload()
}


document.addEventListener("DOMContentLoaded", function(e){

  if(!localStorage.getItem("newReviews")){
    localStorage.setItem("newReviews", "[]")            
  }

  if(localStorage.getItem("userSesion") != null){
    document.getElementById("userPlaceholder").innerHTML = `
    <p class="text-light text-center">Hola 
      <a class="text-info" href="my-profile.html">${JSON.parse(localStorage.getItem("userSesion")).user}</a>
      <span class="text-muted">(<a class="text-muted" href="#" onclick="cerrarSesion()">Salir</a>)</span>
    </p>`
  } else if(!location.href.includes("/login.html")) {
    gotoLogin()
  }

});
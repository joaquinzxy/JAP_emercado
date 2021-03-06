const ORDER_ASC_BY_PRICE = "AZ";
const ORDER_DESC_BY_PRICE = "ZA";
const ORDER_BY_FEATURED = "Cant.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let currentView = "tiles";
let minCount = undefined;
let maxCount = undefined;
let productContainer = document.getElementById("product-list")
let searchBar = document.getElementById("searchInput")

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_FEATURED){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList(){
    let searchValue = searchBar.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    
    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];
        
        if ((((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount)))&&((product.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchValue))||(product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchValue)))){

                if(currentView=="list"){
                    htmlContentToAppend += `  
                    <div href="#" class="list-group-item list-group-item-action">
                        <div class="row p-2">
                            <div class="col-lg-3 col-md-6 col-sm-12">
                            <img src="${product.imgSrc}" class="img-thumbnail" alt="">
                            </div>
                            <div class="col-lg-9 col-md-6 col-sm-12">
                            <div class="row justify-content-between">  
                            <h5 class="productName text-dark">${product.name}</h5>
                            <h3 class="productPrice"><span class="badge badge-pill badge-primary text-light">${product.currency+product.cost}</span></h3>
                            </div>  
                            <p class="productDesc">${product.description}</p>
                            <div class="row justify-content-between mt-5">
                            <div class="col-lg-6 col-md-6 col-sm-12">
                            <span class="productSold text-muted mt-5">Vendidos: ${product.soldCount}</span>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-12 text-right">
                            <button role="button" class="btn btn-sm btn-outline-info" onclick="location.href='product-info.html'">VER PRODUCTO</button>
                            <button type="button" onclick="addToCart(${i})" class="btn btn-sm btn-info" href="#"  data-toggle='modal' data-target='#exampleModal'>AGREGAR AL CARRITO <i
                            class="fas fa-shopping-cart"></i></button>
                            </div>
                          </div>

                            </div>  
                        </div>  
                    </div>
                    `
                } else {
                    htmlContentToAppend += `
                    <div class="col-lg-4 col-md-6 col-sm-12">
                        <div class="card mb-4 shadow-sm custom-card">
                            <img class="bd-placeholder-img card-img-top" src="${product.imgSrc}">
                            <div class="card-body">
                            <h3>${product.name}</h3>
                            <p class="card-text">${product.description}</p>
                            <h3><span class="badge badge-pill badge-primary text-light">${product.currency+product.cost}</span></h3>
                            <button role="button" class="btn btn-sm btn-outline-info" onclick="location.href='product-info.html'">VER PRODUCTO</button>
                            <button type="button" onclick="addToCart(${i})" class="btn btn-sm btn-info" href="#"  data-toggle='modal' data-target='#exampleModal'>AGREGAR AL CARRITO <i
                            class="fas fa-shopping-cart"></i></button>
                            </div>
                            <div class="card-footer">
                            <small class="text-muted">Vendidos: ${product.soldCount}</small>
                        </div>
                        </div>
                    </div>
                    ` 
                }
        }

        productContainer.innerHTML = htmlContentToAppend;
    }
}

function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro las categor??as ordenadas
    showProductsList();
}
//Funci??n que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_FEATURED);
    });

    document.getElementById("lista").addEventListener("click", function(){
        currentView = "list"
        productContainer.className = "list-group"
        showProductsList();
    });

    document.getElementById("tiles").addEventListener("click", function(){
        currentView = "tiles"
        productContainer.className = "tiles-group row"
        showProductsList();
    });

    document.getElementById("searchInput").addEventListener("input", function(){
        showProductsList();
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el m??nimo y m??ximo de los intervalos para filtrar por cantidad
        //de productos por categor??a.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductsList();
    });
});

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", async function (e) {
    //1. Obtener la información. Para eso usamos la función FETCH o la función GETJSONDATA definida en init.js. 
    let promesaProductos = await getJSONData(PRODUCTS_URL)
    var productos = promesaProductos.data
    //3. Hacer prodecimiento para insertar todos los productos en el HTML.

    mostrarProductos("lista", productos)

    document.getElementById("tiles").addEventListener("click", function(){
        mostrarProductos("tiles", productos);
    });

    document.getElementById("lista").addEventListener("click", function(){
        mostrarProductos("lista", productos)
    });
});

function mostrarProductos(visualizacion, productos){
    let listaProductos = document.getElementsByClassName("list-group")[0]
    let tilesProductos = document.getElementsByClassName("tiles-group")[0]

    listaProductos.innerHTML = ""
    tilesProductos.innerHTML = ""

    if(visualizacion == "tiles"){
        for (let i = 0; i < productos.length; i++) {
         tilesProductos.innerHTML +=`
            <div class="col-lg-4 col-md-6 col-sm-12">
                <a href="product-info.html" class="card mb-4 shadow-sm custom-card">
                    <img class="bd-placeholder-img card-img-top" src="${productos[i].imgSrc}">
                    <div class="card-body">
                    <h3>${productos[i].name}</h3>
                     <p class="card-text">${productos[i].description}</p>
                     <h3><span class="badge bg-info">${productos[i].currency+productos[i].cost}</span></h3>
                     </div>
                     <div class="card-footer">
                     <small class="text-muted">Vendidos: ${productos[i].soldCount}</small>
                   </div>
                </a>
            </div>
            `  
    
        }
    } else {
        for (let i = 0; i < productos.length; i++) {
            listaProductos.innerHTML +=`  
            <a href="#" class="list-group-item list-group-item-action">
                <div class="row p-2">
                    <div class="col-lg-3 col-md-6 col-sm-12">
                    <img src="${productos[i].imgSrc}" class="img-thumbnail" alt="">
                    </div>
                    <div class="col-lg-9 col-md-6 col-sm-12">
                    <div class="row justify-content-between">  
                    <h5 class="productName text-dark">${productos[i].name}</h5>
                    <h3 class="productPrice"><span class="badge bg-info">${productos[i].currency+productos[i].cost}</span></h3>
                    </div>  
                    <p class="productDesc">${productos[i].description}</p>
                    <p class="productSold text-right text-muted mt-5">Vendidos: ${productos[i].soldCount}</p>
                    </div>  
                </div>  
            </a>
            `
        }
    }
}

/*
*/
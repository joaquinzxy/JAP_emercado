//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", async function (e) {
    //1. Obtener la información. Para eso usamos la función FETCH o la función GETJSONDATA definida en init.js. 
    let promesaProductos = await getJSONData(PRODUCTS_URL)
    var productos = promesaProductos.data
    //3. Hacer prodecimiento para insertar todos los productos en el HTML.
    let listaProductos = document.getElementsByClassName("list-group")[0]
    for (let i = 0; i < productos.length; i++) {
        console.log(productos[i])
        listaProductos.innerHTML +=`  
        <a href="#" class="list-group-item list-group-item-action">
            <div class="row p-2">
                <div class="col-3">
                <img src="${productos[i].imgSrc}" class="img-thumbnail" alt="">
                </div>
                <div class="col-9">
                <div class="row justify-content-between">  
                <h5 class="productName text-dark">${productos[i].name}</h5>
                <p class="productPrice"><strong>${productos[i].currency+productos[i].cost}</strong></p>
                </div>  
                <p class="productDesc">${productos[i].description}</p>
                <p class="productSold text-right text-muted mt-5">Vendidos: ${productos[i].soldCount}</p>
                </div>  
            </div>  
        </a>
        `
    }
});

/*
*/
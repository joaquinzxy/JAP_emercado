document.addEventListener("DOMContentLoaded", async function(e){
    let promesaCategorias = await getJSONData(CATEGORIES_URL)
    var categorias = promesaCategorias.data
    let listaCategorias = document.getElementsByClassName("container")[1].getElementsByClassName("row")[0]
    for (let i = 0; i < 6; i++) {
        console.log()
        listaCategorias.innerHTML +=`  
        <div class="col-md-4">
        <a href="categories.html" class="card mb-4 shadow-sm custom-card">
          <img class="bd-placeholder-img card-img-top" src="${categorias[i].imgSrc}">
          <h3 class="m-3">${categorias[i].name} <span class="badge bg-info">${categorias[i].productCount}</span></h3>
          <div class="card-body">
            <p class="card-text">${categorias[i].description}</p>
          </div>
        </a>
      </div>
        `
    }
})
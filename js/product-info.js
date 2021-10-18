let currentProduct = []
let currentProductImages = []
let currentReviews = []
let currentRelated = []
let indexProduct = null
let localReviews = JSON.parse(localStorage.getItem("newReviews"))
let localUser = JSON.parse(localStorage.getItem("userSesion")).user

//contenedores primarios del html
let infoContainer = document.getElementById("productInfo")
let infoDescription = document.getElementById("description")
let reviewContainer = document.getElementById("reviewsContainer")
let relatedContainer = document.getElementById("relatedTo")
let estrellasNewReview = document.getElementsByClassName("starsComment")

function getIndexProduct(products){
    let product = products.find(item => item.name=="Chevrolet Onix Joy")
    indexProduct = products.indexOf(product)
}

//muestra la info del producto
function ShowProductInfo(productInfo) {
    if (productInfo != undefined) {
        currentProduct = productInfo;
    }

    let reviewsAvg = countReviews(mergeReviews())
    let slidesContainer = document.getElementsByClassName("carousel-inner")[0]
    let miniSlidesContainer = document.getElementById("miniSlides")
    let productImages = currentProduct.images

    for (let i = 0; i < productImages.length; i++) {
        slidesContainer.innerHTML += `
        <div class="carousel-item" data-interval="2000">
            <img src="${productImages[i]}" class="d-block w-100" alt="...">
        </div>
         `

        miniSlidesContainer.innerHTML += `
        <div class="col px-2">
            <a class="" href="#carouselProduct" role="button" data-slide-to="${i}">
              <img src="${productImages[i]}" class="img-fluid" alt="Responsive image">
            </a>
        </div>
        `
    }
    slidesContainer.getElementsByClassName("carousel-item")[0].classList += " active"

    let nameInfoProductHTML = document.getElementById("nameInfoProduct")
    let reviewInfoProductHTML = document.getElementById("reviewInfoProduct")
    let reviewCounterInfoProductHTML = document.getElementById("reviewCounterInfoProduct")
    let costInfoProductHTML = document.getElementById("costInfoProduct")
    let soldInfoProductHTML = document.getElementById("soldInfoProduct")
    let categoryInfoProductHTML = document.getElementById("categoryInfoProduct")

    nameInfoProductHTML.innerHTML = currentProduct.name
    reviewInfoProductHTML.innerHTML = paintStarsHTML(reviewsAvg.avgRounded)+" ("+reviewsAvg.avg+")"
    reviewCounterInfoProductHTML.innerHTML = reviewsAvg.counter+" reviews"
    costInfoProductHTML.innerHTML = currentProduct.currency + " " + currentProduct.cost
    soldInfoProductHTML.innerHTML = "Vendidos: "+currentProduct.soldCount
    categoryInfoProductHTML.innerHTML = currentProduct.category
    infoDescription.innerHTML += "<p>"+currentProduct.description+"</p>"
}

//Itera las reviews y las inserta una a una en HTML
function showReviews(productReviews) {
    productReviews.forEach(review => {
        let comentario = `
        <div class="media-body">
            <div class="row mt-4">
              <div class="col-md-auto">
                  <h5 class="mt-0">@${review.user + paintStarsHTML(review.score)}</h5>
              </div>
            </div>
           <span class="text-muted">${formatDate(new Date(review.dateTime))}</span>
           <p>${review.description} </p>
        </div>`
        reviewContainer.innerHTML += comentario;
    });
}

//Si el usuario no publicó una review, obtiene los datos y sube la nueva
function publishReview() {
    let reviewButton = document.getElementById("newReviewButton")
    let inputReview = document.getElementById("reviewTextarea")
    let usuarios = localReviews.map(x => x.user)
    if (usuarios.includes(localUser)) {
        reviewButton.disabled = true;
        inputReview.disabled = true;
        document.getElementById("reviewForm").innerHTML = `
        <div class="alert-dismissible fade show text-center alert-danger p-3 my-2" role="alert">
         <strong>Ya dejaste tu opinión <i class="fas fa-long-arrow-alt-right"></i> </strong> Solo se puede dejar una opinión por producto
        </div>
        ` + document.getElementById("reviewForm").innerHTML
    } else {
        let inputReview = document.getElementById("reviewTextarea")
        let starsReview = document.getElementsByClassName("fa fa-star starsComment checked")
        let singleReview = {
            score: starsReview.length,
            description: inputReview.value,
            user: localUser,
            dateTime: new Date()
        }
        if (localStorage.getItem("newReviews")) {
            localReviews.push(singleReview)
            console.log(localReviews)
            localStorage.setItem("newReviews", JSON.stringify(localReviews))
        }
    }
    inputReview.value = ""
    clearStars(estrellasNewReview)
    reviewContainer.innerHTML = ""
    showReviews(mergeReviews())
}


//Recibe un objeto de fecha y lo devuelve formateado
function formatDate(dateObject) {
    let day = dateObject.getDate()
    let month = dateObject.getMonth() + 1
    let year = dateObject.getFullYear()
    return day + "/" + month + "/" + year
}

//Muestra los productos relacionados en base del atributo relatedProducts
function showRelated(productRelated) {
    if (productRelated != undefined) {
        currentRelated = productRelated;
    }

    relatedContainer = relatedContainer.getElementsByClassName("row")[0]
    
    let related = currentProduct.relatedProducts;

    related.forEach(indexRelated => {
        let producto = currentRelated[indexRelated]
        relatedContainer.innerHTML += `
        <div class="col mb-4">
            <div class="card">
                <img src="${producto.imgSrc}" class="card-img-top" alt="${producto.name}">
                <div class="card-body">
                    <a href="product-info.html"><h5 class="card-title">${producto.name}</h5></a>
                    <p class="card-text">${producto.currency + producto.cost}</p>
                </div>
            </div>
        </div>
        `
    });
}

//Carga de forma concatenada reviews, product_info_url & products_url
function loadJsonData() {
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentReviews = resultObj.data
            showReviews(mergeReviews());
        }
        getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                ShowProductInfo(resultObj.data);
            }


            getJSONData(PRODUCTS_URL).then(function (resultObj) {
                if (resultObj.status === "ok") {
                    getIndexProduct(resultObj.data)
                    showRelated(resultObj.data);
                }
            });
        });
    });
}

//Pinta las estrellas on hover
function paintStarsOnHover(evento) { 
    clearStars(estrellasNewReview)
    for (let s = 0; s < evento.target.getAttribute("data-rating"); s++) {
        estrellasNewReview[s].classList.remove("checked");
        if (estrellasNewReview[s].getAttribute("data-rating") == s + 1) {
            estrellasNewReview[s].classList.toggle("checked")
        }
    }
}

//Resetea las estrellas del nuevo comentario
function clearStars(estrellasNewReview) {
    for (let c = 0; c < estrellasNewReview.length; c++) {
        const estrella = estrellasNewReview[c];
        estrella.className = "fa fa-star starsComment"
    }
}

//Devuelve una estructura html de 5 estrellas (llenas o vacias depende del score)
function paintStarsHTML(score){
    let emptyStar = '<span class="fa fa-star"></span>'
    let checkedStar = '<span class="fa fa-star checked"></span>'
    return checkedStar.repeat(score) + emptyStar.repeat(5 - score)
}

//Cuenta las reviews del producto y devuelve 2 promedios, redondeado y con decimal
function countReviews(reviews){
    let scoresAll = reviews.map(s => s.score)
    let reviewsAvg = Math.round((Object.values(scoresAll).reduce((acc, el)=>acc+el,0)/reviews.length) * 10) / 10
    let reviewsObj = {
        "counter": reviews.length,
        "avg": reviewsAvg,
        "avgRounded": Math.round(reviewsAvg)
    }
    return reviewsObj
}

//Fusiona las reviews del JSON con las locales, luego las ordena y retorna
// function mergeReviews() {
//     let localReviews = JSON.parse(localStorage.getItem("newReviews"))
//     let localAndCurrentReviews = currentReviews.map(review => review)
//     localReviews.map(review => localAndCurrentReviews.push(review))
//     localAndCurrentReviews = localAndCurrentReviews.sort(function (a, b) {
//         return new Date(b.dateTime) - new Date(a.dateTime);
//     });
//     return localAndCurrentReviews
// }

function mergeReviews() {
    let localAndCurrentReviews = currentReviews.concat(localReviews)
    localAndCurrentReviews = localAndCurrentReviews.sort(function (a, b) {
        return new Date(b.dateTime) - new Date(a.dateTime);
    });
    return localAndCurrentReviews
}

document.addEventListener("DOMContentLoaded", function (e) {
    loadJsonData();

    for (let i = 0; i < estrellasNewReview.length; i++) {
        const star = estrellasNewReview[i];
        star.addEventListener("mouseover", function (e) { paintStarsOnHover(e) })
    }
});
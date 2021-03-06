const USD = 40;
let cartData = JSON.parse(localStorage.getItem("localCart"))
let actualCurrency = "USD"
let shippingRates = {
    "premium": { "rate": 0.15, "desc": "Costo del 15% sobre el subtotal." },
    "express": { "rate": 0.7, "desc": "Costo del 7% sobre el subtotal." },
    "standar": { "rate": 0.5, "desc": "Costo del 5% sobre el subtotal." }
}
let paymentMethodObj = {
    "selectedPayment": "card",
    "validCard": false,
    "validBank": false
}


const paymentRadios = document.getElementsByName("paymentRadio")
const cardPaymentFieldset = document.getElementById("fieldset-card")
const bankPaymentFieldset = document.getElementById("fieldset-bank")
const paymentInputData = document.getElementsByClassName("paymentInputData")


function currencyConverter(currency) {
    actualCurrency = currency
    cartData.forEach(item => {
        if (item.currency != actualCurrency) {
            item.currency = actualCurrency
            actualCurrency == "USD" ? item.unitCost = item.unitCost / USD : item.unitCost = item.unitCost * USD
        }
    });
    showCart()
}

function showCart() {
    let contenedor = document.getElementById("cart-container")
    contenedor.innerHTML = ""
    if (cartData.length <= 0) {
        document.getElementById("deliveryDetails").innerHTML = ""
        document.getElementById("paymentDetails").innerHTML = ""
        document.getElementById("cartButtons").innerHTML = ""

        document.getElementById("currencyConverter").innerHTML = ""

        contenedor.innerHTML = `<div class='container text-center mt-5'><h3>No hay elementos en tu carrito :( </h3>
                  <div class="col-12 text-center m-4">
              <a class="btn btn-info btn-lg" href="products.html">IR A LA TIENDA</a>
          </div>
        <div>`

    } else {
        for (let i = 0; i < cartData.length; i++) {
            const cartItem = cartData[i];
            contenedor.innerHTML += `          
            <div class="row p-2 cart-item align-items-center">
                  <div class="col-lg-2 col-sm-12 text-center"><img src="${cartItem.src}" class="img-fluid rounded" alt=""></div>
                  <div class="col-lg-4 col-sm-8"><h5><strong>${cartItem.name}</strong></h5></div>
                  <div class="col-lg-2 col-sm-4"><h5 class="text-right">${cartItem.currency + cartItem.unitCost} </h5></div>
                  <div class="col-lg-1 col-sm-6 text-center m-0">
                    <input type="number" name="input${i}" min="1" max="99" onchange="updateCart(this.value, ${i})" value="${cartItem.count}">
                  </div>
                  <div class="col-lg-2 col-sm-6 text-center"><h5 class="text-left subtotal">${cartItem.currency + cartItem.unitCost * cartItem.count} </h5></div>
                  <div class="col-lg-1 col-sm-12 mr-auto><button class="btn btn-info text-right" type="button" onclick="deleteItem(${i})"><i class="fas fa-times-circle text-danger"></i></button></div>
                </div>
            </div>
            <hr>`
        }
    }
    subtotalCalc()
}

function updateCart(valor, id) {

    cartData[id].count = valor

    let items = document.getElementsByClassName("cart-item")
    let subtotal = valor * cartData[id].unitCost
    localStorage.setItem("localCart", JSON.stringify(cartData))
    items[id].getElementsByClassName("subtotal")[0].innerHTML = cartData[id].currency + subtotal
    subtotalCalc()
}

function deleteItem(id) {
    let localCart = JSON.parse(localStorage.getItem("localCart"))
    localCart.splice(id, 1)
    localStorage.setItem("localCart", JSON.stringify(localCart))
    cartData = localCart;
    cartCounter(cartData.map(item => item.count).reduce((count, unitCount) => count + unitCount, 0))
    showCart()
}

function subtotalCalc() {
    let subtotal = cartData.map(item => item.count * item.unitCost).reduce((subtotal, itemSubtotal) => subtotal + itemSubtotal, 0)
    let shippingChoosen = document.getElementById("selectShipping").value
    let shippingCost = shippingRates[shippingChoosen].rate * subtotal
    let total = subtotal + shippingCost

    document.getElementById("finalSubtotal").innerHTML = actualCurrency + subtotal
    document.getElementById("shippingCost").innerHTML = actualCurrency + shippingCost + " <small><a href='#'  data-toggle='modal' data-target='#shippingModal'>(Ver tarifas)</a></small>"
    document.getElementById("totalOrder").innerHTML = actualCurrency + total

}

function methodValidation(){
    if (paymentMethodObj.selectedPayment==="bank") {
        let inputBankAccount = document.getElementById("inputBankAccount")
        paymentMethodObj.validBank = true
        if (inputBankAccount.value != "") {
            document.getElementById("bank-validation-badge").innerHTML=' <span class="badge badge-success">VALIDADA</span>' 
        }
    } else {
        paymentMethodObj.validBank = false
    }
    if(paymentMethodObj.selectedPayment==="card") {
        let inputCardNumber = document.getElementById("inputNumberCard")
        let inputCardCCV = document.getElementById("inputPinCard")
        let inputCardDate = document.getElementById("inputDateCard")
        paymentMethodObj.validCard = true
        if (inputCardNumber.value != "" && inputCardCCV.value != "" && inputCardDate.value != "") {
            document.querySelector("#card-icon").innerHTML = creditCardType(inputCardNumber.value);
            document.getElementById("card-validation-badge").innerHTML="VALIDADA"
            document.getElementById("card-validation-badge").innerHTML=' <span class="badge badge-success">VALIDADA</span>' 

        } else {
            paymentMethodObj.validCard = false
        }
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    currencyConverter(actualCurrency)

    paymentRadios.forEach(radio => {
        radio.addEventListener("change", (event) => {
            let paymentType = event.target.value
            if (paymentType === "bank") {
                cardPaymentFieldset.setAttribute("disabled", "");
                bankPaymentFieldset.removeAttribute("disabled");
            } else {
                bankPaymentFieldset.setAttribute("disabled", "");
                cardPaymentFieldset.removeAttribute("disabled");
            }
            paymentMethodObj.selectedPayment = paymentType
        })
    });

    for (const input of paymentInputData) {
        input.addEventListener("change", (e)=>{
            let method = e.target.dataset.method
            if(method=="card"){
                document.getElementById("card-validation-badge").innerHTML=' <span class="badge badge-warning">MODIFICADA</span>' 
                paymentMethodObj.validCard = false
            }
            if(method=="bank"){
                document.getElementById("bank-validation-badge").innerHTML=' <span class="badge badge-warning">MODIFICADA</span>' 
                paymentMethodObj.validBank = false

            }
        })
    }

});
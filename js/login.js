//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

});

let usuario = {}
function loginCheck(){
    //Se buscan los elementos de Input y también h5 y p dentro del modal
    let userInput = document.getElementsByName("user")[0].value;
    let passInput = document.getElementsByName("pass")[0].value;
    let loginModalTitle = document.getElementsByClassName("modal-title")[0]
    let loginModalBody = document.getElementsByClassName("modal-text")[0]
    //Si los input no están vacios el inicio es exitoso
    if((userInput != "") && (passInput != "")){
        //Se modifican los datos del modal
        loginModalTitle.innerHTML = "Bienvenido "+userInput+"!"
        loginModalBody.innerHTML = "Inicio de sesión exitoso :) <br><br> Serás redirigido automaticamente hacia la tienda!"
        //el token se vuelve true
        loginToken = true;
        //Se envía la info user y token a la función encargada de guardar sesión
        guardarSesion(userInput, loginToken)
        setTimeout(() => {
            //Luego de 2,5 segundos automaticamente redirecciona al inicio
            window.location.replace("index.html");
            return true;
        }, 2500);
    } else {
        loginModalTitle.innerHTML = "Credenciales incorrectas!"
        loginModalBody.innerHTML = "Usuario o contraseña invalidas, intente nuevamente"}
        return false;
}


//Recibe usuario y un "token" y crea el objeto userData, al momento de realizar el Login exitoso
function guardarSesion(usuarioInput, tokenSesion){
    let userData = {
        user: usuarioInput,
        token: tokenSesion
    }
    //parsea el object en String y lo guarda en LocalStore
    localStorage.setItem("userSesion", JSON.stringify(userData))
}

function onSignIn(googleUser){
    let userInfo = JSON.stringify(googleUser.getBasicProfile())
    usuario = userInfo
    let userMail = userInfo.eT 
    //Se modifican los datos del modal
    let loginModalTitle = document.getElementsByClassName("modal-title")[0]
    let loginModalBody = document.getElementsByClassName("modal-text")[0]
    loginModalTitle.innerHTML = "Bienvenido "+userInfo.Ne+"!"
    loginModalBody.innerHTML = "Inicio de sesión exitoso :) <br><br> Serás redirigido automaticamente hacia la tienda!"
    //el token se vuelve true
    loginToken = true;
    //Se envía la info user y token a la función encargada de guardar sesión
    guardarSesion(userMail, loginToken)
     setTimeout(() => {
         $('#modalLogin').modal(options)
         //Luego de 2,5 segundos automaticamente redirecciona al inicio
         //window.location.replace("index.html");
         return true;
     }, 2500);
}



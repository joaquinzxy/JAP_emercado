//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    if (localStorage.getItem("userSesion")) {
        if (Object.entries(userData).length<3) {
            triggerModal("DATOS PERSONALES", "Datos incompletos, recuerda completar tu información personal para tener una experiencia más personalizada")
            console.log(Object.entries(userData).length)
        }
        getUserData()
    }

    document.getElementById("uploadButton").addEventListener("click", (e)=>{
        document.getElementById("file-upload").click()
    })
});

let userData = JSON.parse(localStorage.getItem("userSesion"))

//Configuraciones para el elemento que sube archivos
var dzoptions = {
    url: "/",
    maxFiles: 1,
    autoQueue: false
};

var myDropzone = new Dropzone("div#file-upload", dzoptions);

myDropzone.on('thumbnail', function(file, dataURL) {
    let userPhotoContainer = document.getElementById("userphoto")
    userPhotoContainer.src=dataURL
    userData.photoURL = dataURL
});

myDropzone.on("maxfilesexceeded", function(file)
{
    this.removeAllFiles();
    this.addFile(file);
});

function setUserData() {
    userData.name = document.getElementById("name").value;
    userData.surname = document.getElementById("surname").value;
    userData.email = document.getElementById("email").value;
    userData.phone = document.getElementById("phone").value;
    userData.age = document.getElementById("age").value;
    localStorage.setItem("userSesion", JSON.stringify(userData))
    triggerModal("DATOS GUARDADOS!", "Gracias por completar tus datos!")
    return false
}

function getUserData() {
    userData = JSON.parse(localStorage.getItem("userSesion"))
    document.getElementById("name").value = userData.name || ""
    document.getElementById("surname").value = userData.surname || ""
    document.getElementById("email").value = userData.email || ""
    document.getElementById("phone").value = userData.phone || ""
    document.getElementById("age").value = userData.age || ""
    document.getElementById("userphoto").src= userData.photoURL || "/img/user_icon.png"
}

function triggerModal(title, body){
    let loginModalTitle = document.getElementsByClassName("modal-title")[0]
    let loginModalBody = document.getElementsByClassName("modal-text")[0]
    loginModalTitle.innerHTML = title
    loginModalBody.innerHTML = body
    $('#modalLogin').modal()
}


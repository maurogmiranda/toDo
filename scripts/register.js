const formulario = document.querySelector("form")
let nombre 
let apellido
let email
let contrasenia
let confirmContrasenia
const url = "https://ctd-todo-api.herokuapp.com/v1/users"

window.addEventListener("load",function(){
    formulario.addEventListener("submit",function(e){
        e.preventDefault()
        nombre = document.getElementById("nombre").value
        apellido = document.getElementById("apellido").value
        email = document.getElementById("mail").value
        contrasenia = document.getElementById("contrasenia").value
        confirmContrasenia = document.getElementById("confir-contrasenia").value

        const payload = {
            firstName:nombre,
            lastName:apellido,
            email:email,
            password:contrasenia
        }
        const settings = {
            method:"POST",
            body: JSON.stringify(payload),
            headers:{ 'Content-Type': 'application/json'}
        }

        if(contrasenia === confirmContrasenia){
           fetch (url,settings)
           .then(response => {
               if(response.status !=200 && response.status !=201){
                   throw("algo fallo status: "+ response.status)
               }else{
                   return response.json()
               }
           })
           .then(respuesta => {
               console.log(respuesta);
               const user = {
                  jwt: respuesta.jwt,
                  name: nombre 
               }
               localStorage.setItem("user",JSON.stringify(user))
               location.replace("index.html")
          })
           .catch(error => alert(error))
        }else{
            alert("se ingreso 2 contraseñas diferentes")
        }

    })




})
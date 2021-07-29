 /* -------------------------------------------------------------------------- */
/*             realizamos la lógica una vez que carga el documento            */
/* -------------------------------------------------------------------------- */ 
  /* ---------- mostramos el nombre del usuario en la barra superior ---------- */
  const userName = document.querySelector('.user-info p');
  const deposito = JSON.parse(localStorage.user)
  userName.innerText = deposito.name; 
  let tareasPendientes = document.querySelector('.tareas-pendientes');
  let tareasTerminadas = document.querySelector('.tareas-terminadas');
  AOS.init();

  /* ---------------- creamos la funcionalidad de cerrar sesion --------------- */
  const btnCerrarSesion = document.querySelector('#closeApp');
  btnCerrarSesion.addEventListener('click', function () {
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      text: 'Cerraremos su sesión en este navegador.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, por favor!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Hasta luego!',
          '',
          'success'
        )
        //limpiamos el localstorage y redireccioamos a login
        localStorage.clear();
        location.replace('login.html');
      } 
    })

  })

  /* ------------- trabajamos la renderizacion de nuestrars tareas ------------ */
  const urlTareas = 'https://ctd-todo-api.herokuapp.com/v1/tasks'
  const usuario = JSON.parse(localStorage.user);
  const token = usuario.jwt;
 


  consultarTareas()


  /* -------------------- escuchar el boton de crear tarea -------------------- */
  const formCrearTarea = document.querySelector('.nueva-tarea');
  const nuevaTarea = document.querySelector('#nuevaTarea');

  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault();
    if(nuevaTarea.value!=""){
    const payload = {
      description: nuevaTarea.value.trim()
    };
    const settings = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        authorization: token
      }
    }
    fetch(urlTareas, settings)
      .then(response => response.json())
      .then(tarea => {
        renderizarTarea(tarea)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Nueva tarea registrada!',
          showConfirmButton: false,
          timer: 900
        })
      })
      .catch(error => console.log(error));


    //limpiamos el form
    formCrearTarea.reset();}
  })


  /* -------------------------------------------------------------------------- */
  /*                                  funciones                                 */
  /* -------------------------------------------------------------------------- */
    
  function consultarTareas() {
    const settings = {
      method: 'GET',
      headers: {
        authorization: token
      }
    };
    const skeletons = document.querySelectorAll("#skeleton")
    console.log("Consultando mis tareas");
    fetch(urlTareas, settings)
      .then(response => response.json())
      .then(tareas => {
       tareas.forEach(tarea => {
        skeletons.forEach(skeleton => skeleton.remove())
        renderizarTarea(tarea)
       
        })
        skeletons.forEach(skeleton => skeleton.remove());
      })
      .catch(error => console.log(error));
  }

  function cambiarTareaATerminada(tarea){
    const payload = {
      description: tarea.querySelector(".nombre").innerText,
      completed: true
    }
    const settings = {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
        
      }}
      fetch(urlTareas+"/"+tarea.querySelector(".idTarea").innerText,settings)
      .then(response => response.json())
      .then(tarea => {
        renderizarTarea(tarea)  
    })
    }

    function cambiarTareaAPendiente(tarea){
      const payload = {
        description: tarea.querySelector(".nombre").innerText,
        completed: false
      }
      const settings = {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          authorization: token,  
        }}

        fetch(urlTareas+"/"+tarea.querySelector(".idTarea").innerText,settings)
        .then(response => response.json())
        .then(tarea => {
          renderizarTarea(tarea)
      })  
      }
   
    function eliminarTarea(id){

      const settings = {
        method: "DELETE",
      
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
          
        }}
        fetch(urlTareas+"/"+id,settings)
        .then(response => response.json())
        .then(tarea => {
          console.log(tarea)
      })
      }
  

  function renderizarTarea(tarea) {
    let fechaArray = tarea.createdAt.split("")
    let fecha =fechaArray[8]+fechaArray[9]+"/"+fechaArray[5]+fechaArray[6]+"/"+fechaArray[2] + fechaArray[3]
      if (!tarea.completed ) {
        //lo mandamos al listado de tareas incompletas
        tareasPendientes.innerHTML += `
        <li class="tarea" data-aos="fade-down" id="${tarea.id}">
          <div class="not-done" onclick = "btnNotDone(${tarea.id})"></div>
          <div class="idTarea">${tarea.id}</div>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <p class="timestamp"><i class="far fa-calendar-alt"></i> Creada:${fecha}</p>
          </div>
        </li>
        ` 
      } else if (tarea.completed) {
        //lo mandamos al listado de tareas terminadas
        tareasTerminadas.innerHTML = `
        <li class="tarea" data-aos="fade-down"  id="${tarea.id}">
          <div class="not-done" onclick ="btnNotDone(${tarea.id})"></div>
          <div class="idTarea">${tarea.id}</div>
          <div class="descripcion">
          <p class="nombre">${tarea.description}</p>
          <div class="fecha-trash">
          <p class="timestamp"><i class="far fa-calendar-alt"></i> Creada: ${fecha}</p>
          <i onclick="btnDelete(${tarea.id})" class="far fa-trash-alt"></i>
          </div>
          </div>
        </li>` + tareasTerminadas.innerHTML
         
      }  
    }
    // hago que los botones de las tareas y los botones de eliminar tengan funcionalidad
 
function btnNotDone(id){
  let tareaAcambiar = document.getElementById(id)
  if(perteneceAlNodo(tareasTerminadas.querySelectorAll(".tarea"),tareaAcambiar)){
    tareasTerminadas.removeChild(tareaAcambiar)
    cambiarTareaAPendiente(tareaAcambiar)
  }else{
    tareasPendientes.removeChild(tareaAcambiar)
    cambiarTareaATerminada(tareaAcambiar)
  }

}

function btnDelete(id){

  let tareaABorrar = document.getElementById(id)
  Swal.fire({
    title: "¿Desea eliminar la tarea de forma permanente?",
    text: "",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, eliminala!'
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarTarea(id)
    if(perteneceAlNodo(tareasTerminadas.querySelectorAll(".tarea"),tareaABorrar)){
      tareasTerminadas.removeChild(tareaABorrar)
    }else{
      tareasPendientes.removeChild(tareaABorrar)
  }
      Swal.fire(
        'Eliminada!',
        'su tarea ha sido eliminada.',
        ''
      )
    }
  })

  
 
}

function perteneceAlNodo(nodo,elemento){
  for(let i=0;i<nodo.length;i++){
    if(nodo[i] === elemento){
      return true
    }
  }
  return false
}
//template de tarea
/* <li class="tarea">
      <div class="not-done"></div>
      <div class="descripcion">
        <p class="nombre">Mi hermosa tarea</p>
        <p class="timestamp">Creada: 19/04/20</p>
      </div>
    </li> */

    
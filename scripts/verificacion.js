if (!localStorage.user) {
    location.replace('login.html')
  }else{
    const usuario = JSON.parse(localStorage.user)
    const token = usuario.jwt
    const settings = {
      method: 'GET',
      headers: {
        authorization: token
      }
    };

    fetch("https://ctd-todo-api.herokuapp.com/v1/users/getMe",settings)
    .then(responce => {if(responce.status===401){location.replace('login.html')}})
  }
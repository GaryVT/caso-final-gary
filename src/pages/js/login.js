document.addEventListener("DOMContentLoaded", () => {
  function logOutButton() {
    // Eliminar el estado de sesion
    sessionStorage.removeItem("loggedIn");
    //console.log("Usuario ha cerrado sesión."); 
    window.location.href = "login.html";
  }

  // Función para verificar si el usuario está autenticado
  function checkAuthentication() {
    const loggedIn = sessionStorage.getItem("loggedIn");
    const logoutButton = document.getElementById("logout-button");

    if (logoutButton) {
      if (loggedIn) {
        logoutButton.style.display = "block";
      } else {
        logoutButton.style.display = "none";
      }
    }
  }

  // Evento al boton de cerrar sesion
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logOutButton);
  }

  // LLamar al cargas pagina
  checkAuthentication();
});

// Evento de inicio de sesión
document
  .querySelector("login-component")
  .addEventListener("login-success", (event) => {
    const username = event.detail.username;
    sessionStorage.setItem("loggedIn", "true"); // Guardar el estado de inicio de sesión
    console.log("Usuario ha iniciado sesión:", username);
    window.location.href = "index.html";
  });

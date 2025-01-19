import "./error-message.js";
class LoginComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: Arial, sans-serif;
        }
        .container {
            display: flex;
            width: 100%;
            height: 100%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .left {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 20px;
        }
        .left h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .left form {
            width: 100%;
            max-width: 300px;
        }
        .left form input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .left form button {
            width: 100%;
            padding: 10px;
            background-color: black;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .left form button:hover {
            background-color: #333;
        }
        .left .register {
            margin-top: 20px;
            font-size: 14px;
        }
        .left .register a {
            color: black;
            text-decoration: none;
            font-weight: bold;
        }
        .left .register a:hover {
            text-decoration: underline;
        }
        .right {
            flex: 1;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .right img {
            max-width: 100%;
            height: auto;
        }
        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }
            .right {
                display: none;
            }
        }
      </style>
      <div class="container">
        <div class="left">
          <h1>Bienvenido</h1>
          <form id="login-form">
            <input placeholder="tu@email.com" required type="email" id="username"/>
            <input placeholder="contraseña" required type="password" id="password"/>
            <button type="submit">Iniciar Sesion</button>
          </form>
          <div class="register">
            ¿No tienes una cuenta? <a href="/src/pages/html/register.html">Registrate aqui.</a>
          </div>
          <error-message id="error-message"></error-message> 

        </div>
        <div class="right">
          <img alt="Background del login" src="https://getzelos.com/wp-content/uploads/2023/10/delegating-tasks.jpg"/>
        </div>
      </div>
    `;

    this.shadowRoot
      .querySelector("#login-form")
      .addEventListener("submit", (event) => {
        event.preventDefault(); // Prevenir el envio del formulario
        this.handleLogin();
      });
  }

  handleLogin() {
    const username = this.shadowRoot.querySelector("#username").value;
    const password = this.shadowRoot.querySelector("#password").value;

    // Validar los datos
    if (!username || !password) {
      //alert("Por favor, completa todos los campos.");
      this.showError("Por favor, completa todos los campos."); // Usar el componente de error
      return;
    }

    // Recuperar usuarios del localstorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === username && user.password === password
    );

    // Verificar si existe
    if (user) {
      sessionStorage.setItem("loggedIn", "true");
      this.dispatchEvent(
        new CustomEvent("login-success", {
          bubbles: true,
          detail: { username },
        })
      );
    } else {
      //aler("Usuario o contraseña incorrectos.");
      this.showError("Usuario o contraseña incorrectos."); // Usar el componente de error

    }
  }

  showError(message) {
    const errorMessage = this.shadowRoot.querySelector("#error-message");
    if (errorMessage) {
      errorMessage.show(message); // Mostrar el mensaje de error del modal (componente)
    }
  }
}

customElements.define("login-component", LoginComponent);

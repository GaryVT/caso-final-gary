import "./error-message.js";
class RegisterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
        html {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #8f2626;
        }
        .container {
          display: flex;
          width: 100%;
          height: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        .form-container {
          flex: 1;
          padding: 40px;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .form-container h1 {
          font-size: 2em;
          margin-bottom: 20px;
        }
        .form-container label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-container input {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .form-container button {
          width: 100%;
          padding: 10px;
          background-color: #000;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 1em;
          cursor: pointer;
        }
        .form-container button:hover {
          background-color: #333;
        }
        .form-container p {
          text-align: center;
          margin-top: 20px;
        }
        .form-container p a {
          color: #000;
          text-decoration: none;
          font-weight: bold;
        }
        .form-container p a:hover {
          text-decoration: underline;
        }
        .image-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
        }
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }
          .image-container {
            display: none;
          }
        }
      </style>
      <div class="container">
        <div class="form-container">
          <h1>Registro</h1>
          <error-message id="error-message"></error-message> 
          <form id="register-form">
            <label for="name">Nombre</label>
            <input id="name" name="name" placeholder="Juan Perez" type="text" required />
            <label for="email">Email</label>
            <input id="email" name="email" placeholder="tu@email.com" type="email" required />
            <label for="password">Contraseña</label>
            <input id="password" name="password" placeholder="Contraseña" type="password" required />
            <label for="confirm-password">Confirmar Contraseña</label>
            <input id="confirm-password" name="confirm-password" placeholder="Contraseña" type="password" required />
            <button type="submit">Registrarse</button>
          </form>
          <p>
            ¿Ya tiene una cuenta?
            <a href="/src/pages/html/login.html">Inicia sesión</a>
          </p>
        </div>
        <div class="image-container">
          <img
            alt="Background-register"
            src="https://cdn.prod.website-files.com/5f7cf835bc0fc5eb13e5c57d/65c053f1a1e9fc64896780a9_PNh15uCqkaIAj5C8dUVVN3RqLBTHbAKHy6e23_nsZaLVCD59lKqtCk_7Vgx2GQewOndQ4BF8_28FKt0z_WSBIAqNHpAHJGE-PhiJFLcMWBRf4gk9z6AGEesNaeJ87Svx3E2L9IH5x5VY91vg1W6PyIs.jpeg"
          />
        </div>
      </div>
    `;

    this.shadowRoot
      .querySelector("#register-form")
      .addEventListener("submit", (event) => {
        event.preventDefault(); // Prevenir envio del formulario
        this.handleRegister();
      });
  }

  handleRegister() {
    const name = this.shadowRoot.querySelector("#name").value;
    const email = this.shadowRoot.querySelector("#email").value;
    const password = this.shadowRoot.querySelector("#password").value;
    const confirmPassword = this.shadowRoot.querySelector("#confirm-password").value;

    // Validar los datos
    if (!name || !email || !password || !confirmPassword) {
      this.showError("Por favor, completa todos los campos.");
      return;
    }

    // Validar que el nombre solo contenga letras y espacios
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      this.showError("El nombre solo puede contener letras y espacios.");
      return;
    }

    if (password !== confirmPassword) {
      this.showError("Las contraseñas no coinciden."); // Mensaje de Error (componente)
      return;
    }

    // Buscar correo en localstorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      this.showError("Este correo electrónico ya está registrado."); // Mensaje de Error (componente)
      return;
    }

    // Nuevo usuario
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    //alert("Registro exitoso. Puedes iniciar sesión ahora.");
    window.location.href = "/src/pages/html/login.html"; // Redirigir a login
  }

  showError(message) {
    const errorMessage = this.shadowRoot.querySelector("#error-message");
    if (errorMessage) {
      errorMessage.show(message); // Mostrar el mensaje de error del modal (componente)
    }
  }
}

customElements.define("register-component", RegisterComponent);
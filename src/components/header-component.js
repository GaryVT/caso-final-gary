class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";
    this.shadowRoot.appendChild(link);

    this.shadowRoot.innerHTML += `
    <style>
    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
    }

    .header {
        background-image: url('https://i.pinimg.com/736x/6b/df/6a/6bdf6aedf9da019d2581a5b1423a72a6.jpg');
        background-size: cover;
        padding: 20px 40px;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .header .logo {
        font-size: 28px;
        font-weight: bold;
        color: white;
    }
    .header .search {
        display: flex;
        align-items: center;
    }
    .header .search button {
        background-color: rgba(0, 0, 0, 0.6);
        border: none;
        color: white;
        padding: 10px 15px;
        cursor: pointer;
        margin-left: 10px;
        border-radius: 5px;
        transition: background-color 0.3s; 
    }
    .header .search button:hover {
        background-color: rgba(77, 76, 76, 0.8); 
    }

    .nav {
        background-color: white;
        padding: 10px 20px;
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #ddd;
    }
    .nav a {
        color: #333;
        text-decoration: none;
        font-weight: bold;
        display: flex;
        align-items: center;
        padding: 10px;
        border-radius: 5px;
        transition: background-color 0.3s; 
    }
    .nav a:hover {
        background-color: rgba(0, 0, 0, 0.1); 
    }
    .nav a i {
        margin-right: 5px;
    }
</style>
        <header class="header">
          <div class="logo">Task Board</div>
          <div class="search">
            <button id="addTaskButton" title="Add Task">Añadir</button>
            <button id="logOutButton" title="Log out">Salir</button>
          </div>
        </header>
     <div class="nav">
  <a href="#" id="showInProgress">
    En progreso 💪
  </a>
    <a href="#" id="showBoth">
    Todas 👍
  </a>
  <a href="#" id="showDone">
    Completada 👌
  </a>

</div>

      `;

    // Evento de logout
    this.shadowRoot
      .querySelector("#logOutButton")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("logout", { bubbles: true }));
      });

    // Evento de añadir tarea
    this.shadowRoot
      .querySelector("#addTaskButton")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("add-task", { bubbles: true }));
      });

    //Eventos para mostrar tareas (filtro)
    this.shadowRoot
      .querySelector("#showInProgress")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this.dispatchEvent(
          new CustomEvent("show-in-progress", { bubbles: true })
        );
      });

    this.shadowRoot
      .querySelector("#showDone")
      .addEventListener("click", (event) => {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent("show-done", { bubbles: true }));
      });

    this.shadowRoot
      .querySelector("#showBoth")
      .addEventListener("click", (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del enlace
        this.dispatchEvent(new CustomEvent("show-both", { bubbles: true }));
      });
  }
}

customElements.define("header-component", HeaderComponent);


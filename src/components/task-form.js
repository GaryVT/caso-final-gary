import "./error-message.js";

class TaskForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
    this.isEditing = false; // Estamos editando?
    this.currentTaskItem = null; // Tarea actual referencia
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --modal-background: rgba(255, 255, 255, 0.9);
          --modal-overlay: rgba(0, 0, 0, 0.6);
          --button-background: black; 
          --button-hover: #333; 
          --text-color: #333;
          --label-color: #555;
          --border-radius: 8px;
          --input-border: #ddd;
        }

        .modal {
          display: none;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: var(--modal-overlay);
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background-color: var(--modal-background);
          padding: 20px;
          border-radius: var(--border-radius);
          box-shadow: 0 4px 8px black; 
          width: 90%;
          max-width: 500px;
          box-sizing: border-box;
        }

        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          cursor: pointer;
        }

        .close:hover {
          color: black;
        }

        h2 {
          color: var(--text-color);
          margin-bottom: 20px;
          font-size: 20px;
          text-align: center;
        }

        label {
          display: block;
          margin-bottom: 8px;
          color: var(--label-color);
          font-size: 14px;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid var(--input-border);
          border-radius: var(--border-radius);
          font-size: 16px;
          color: var(--text-color);
          box-sizing: border-box;
        }

        input[type="text"]:focus,
        textarea:focus {
          border-color: var(--input-focus);
          outline: none;
        }

        textarea {
          resize: none;
          height: 80px;
        }

        button {
          background-color: var(--button-background);
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: 16px;
          width: 100%;
        }

        button:hover {
          background-color: var(--button-hover);
        }
      </style>
      <div class="modal" id="taskModal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>${this.isEditing ? "Editar Tarea" : "Agregar Nueva Tarea"}</h2>
          <label for="taskName">Nombre de la tarea:</label>
          <input type="text" id="taskName" placeholder="Nombre de la tarea" />
          <label for="taskDescription">Descripción:</label>
          <textarea id="taskDescription" placeholder="Descripción de la tarea"></textarea>
          <button id="saveTaskButton">${this.isEditing ? "Actualizar Tarea" : "Guardar Tarea"
      }</button>
          <error-message id="error-message"></error-message>
        </div>
      </div>
    `;

    this.modal = this.shadowRoot.getElementById("taskModal");
    this.closeButton = this.shadowRoot.querySelector(".close");
    this.saveButton = this.shadowRoot.getElementById("saveTaskButton");
    this.errorMessage = this.shadowRoot.getElementById("error-message");

    this.closeButton.addEventListener("click", () => this.close());
    this.saveButton.addEventListener("click", () => this.saveTask());
  }

  open(taskItem = null) {
    if (taskItem) {
      this.isEditing = true; // Si estamos editando, modo edicion
      this.currentTaskItem = taskItem; // Guardar la referencia de la tarea
      this.shadowRoot.getElementById("taskName").value =
        taskItem.getAttribute("name");
      this.shadowRoot.getElementById("taskDescription").value =
        taskItem.getAttribute("description");
    } else {
      this.isEditing = false; // Modo de creación
      this.clearFields();
    }
    this.modal.style.display = "flex"; // Cambiado a flex para centrar el modal
  }

  // Cerrar form
  close() {
    this.modal.style.display = "none";
    this.clearFields();
    this.isEditing = false; // Resetear el estado
    this.currentTaskItem = null; // Limpiar la referencia
  }

  clearFields() {
    this.shadowRoot.getElementById("taskName").value = "";
    this.shadowRoot.getElementById("taskDescription").value = "";
    this.errorMessage.hide(); // Ocultar el mensaje de error al limpiar los campos
  }

  saveTask() {
    const name = this.shadowRoot.getElementById("taskName").value;
    const description = this.shadowRoot.getElementById("taskDescription").value;
    if (!name || !description) {
      this.errorMessage.show("Por favor, completa todos los campos."); // Mostrar el mensaje de error
      return;
    }
    const event = new CustomEvent("task-saved", {
      detail: { name, description, taskItem: this.currentTaskItem },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
    this.close();
  }
}

customElements.define("task-form", TaskForm);
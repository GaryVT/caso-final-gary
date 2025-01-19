import { updateTask } from "../utils/api.js";
import "./error-message.js";
class EditForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
    this.currentTaskItem = null; //para la referencia a la tarea actual
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
<div class="modal" id="editModal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Editar Tarea</h2>
        <label for="editTaskName">Nombre de la tarea:</label>
        <input type="text" id="editTaskName" placeholder="Nombre de la tarea" required />
        <label for="editTaskDescription">Descripción:</label>
        <textarea id="editTaskDescription" placeholder="Descripción de la tarea" required></textarea>
        <button id="saveEditButton">Actualizar Tarea</button>
        <error-message id="error-message"></error-message> 

    </div>
</div>
      `;

    this.modal = this.shadowRoot.getElementById("editModal");
    this.closeButton = this.shadowRoot.querySelector(".close");
    this.saveButton = this.shadowRoot.getElementById("saveEditButton");

    this.closeButton.addEventListener("click", () => this.close());
    this.saveButton.addEventListener("click", () => this.saveTask());
  }

  // Abrir y obtener datos
  open(taskItem) {
    this.currentTaskItem = taskItem;
    this.shadowRoot.getElementById("editTaskName").value =
      taskItem.getAttribute("name");
    this.shadowRoot.getElementById("editTaskDescription").value =
      taskItem.getAttribute("description");
    this.modal.style.display = "flex"; // Cambiando a flex para centrar
  }

  close() {
    this.modal.style.display = "none";
    this.clearFields();
    this.currentTaskItem = null;
  }

  clearFields() {
    this.shadowRoot.getElementById("editTaskName").value = "";
    this.shadowRoot.getElementById("editTaskDescription").value = "";
  }

  // Guardar datos a la api
  async saveTask() {
    const name = this.shadowRoot.getElementById("editTaskName").value;
    const description = this.shadowRoot.getElementById(
      "editTaskDescription"
    ).value;

    if (name && description && this.currentTaskItem) {
      const id = this.currentTaskItem.getAttribute("id"); // Id de tarea
      const updatedTask = {
        name,
        description,
        completed: this.currentTaskItem.getAttribute("completed") === "true",
      };

      try {
        await updateTask(id, updatedTask);
        // Actualizando atributos del taskItem
        this.currentTaskItem.setAttribute("name", name);
        this.currentTaskItem.setAttribute("description", description);
        this.close();
      } catch (error) {
        //console.error("Error al actualizar la tarea:", error);
        this.showError("Error al actualizar la tarea:", error);
      }
    } else {
      //console.error("Faltan datos para guardar la tarea.");
      this.showError("Faltan datos para guardar la tarea."); // Mostrar mensaje de error si faltan datos
    }
  }

  showError(message) {
    const errorMessage = this.shadowRoot.querySelector("#error-message");
    if (errorMessage) {
      errorMessage.show(message); // Mostrar el mensaje de error del modal (componente)
    }
  }
}

customElements.define("edit-form", EditForm);

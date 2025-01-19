import { updateTask, deleteTask } from "../utils/api.js";
import "./error-message.js";

class TaskItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    console.log("Instancia de TaskItem creada");
    this.isRendered = false; // Control de renderizado
  }

  static get observedAttributes() {
    return ["name", "description", "completed", "id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Atributo cambiado: ${name}, de ${oldValue} a ${newValue}`);
    if (this.isRendered) {
      this.render(); // Lo llama solo si ha renderizado
    }
  }

  connectedCallback() {
    this.render(); // Llama a render cuando el componente se conecta al DOM
    this.isRendered = true; // Marca como renderizado
  }

  render() {
    const name = this.getAttribute("name") || "Tarea";
    const description =
      this.getAttribute("description") || "Descripción de la tarea";
    const completed = this.getAttribute("completed") === "true";
    const id = this.getAttribute("id");

    console.log("Task ID:", id); // Agregar este log para verificar el ID

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --card-background: white;
          --label-task: rgb(31, 102, 207);
          --button-gray: #ccc;
          --button-on: rgb(90, 90, 90);
          --text-color: #172b4d;
          --box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          --name-color: rgb(0, 0, 0);
          --description-color: rgb(107, 84, 241);
          --font-family: Arial, sans-serif;
        }
        .card {
          background-color: var(--card-background);
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 4px;
          box-shadow: var(--box-shadow);
          font-family: var(--font-family);
        }
        .label {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 12px;
          color: white;
          margin-bottom: 10px;
          background-color: var(--label-task);
        }
        .actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .actions button {
          margin-right: 10px;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          background-color: var(--button-gray);
          color: white;
          cursor: pointer;
        }
        .actions button:hover {
          background-color: var(--button-on);
        }
        .type {
          font-size: 20px;
          font-weight: bold;
          color: var(--name-color);
          margin: 10px 0;
        }
        .description {
          font-size: 14px;
          color: var(--description-color);
          margin-top: 5px;
        }
      </style>
      <div class="card">
        <div class="label">${completed ? "REALIZADO" : "TAREA"}</div>
        <div class="actions">
          <button class="completedButton">${completed ? "REVERTIR" : "TERMINADA"
      }</button>
          <button class="editButton">EDITAR</button>
          <button class="deleteButton"><i class="fas fa-trash"></i> ELIMINAR</button>
        </div>
        <div class="type"><i class="fas fa-book"></i> ${name}</div>
        <div class="description">${description}</div>
        <error-message id="error-message"></error-message>
      </div>
    `;

    this.addEventListeners(id); // Pasar el ID a la función de eventos
  }

  addEventListeners(id) {
    const completedButton = this.shadowRoot.querySelector(".completedButton");
    completedButton.addEventListener("click", async () => {
      const completed = this.getAttribute("completed") === "true";
      const newCompletedState = !completed;
      this.setAttribute("completed", newCompletedState);

      const taskId = this.getAttribute("id");
      const updatedTask = {
        name: this.getAttribute("name"),
        description: this.getAttribute("description"),
        completed: newCompletedState,
      };

      try {
        await updateTask(taskId, updatedTask);
        this.dispatchEvent(
          new CustomEvent("task-completed", {
            detail: {
              completed: newCompletedState,
              id: taskId,
            },
          })
        );
      } catch (error) {
        console.error("Error al actualizar la tarea:", error);
        this.showError("Error al actualizar la tarea: " + error.message); // Mostrar el mensaje de error
      }
    });

    const editButton = this.shadowRoot.querySelector(".editButton ");
    editButton.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("edit-task", {
          detail: {
            taskItem: this, // Pasando objeto completo
          },
        })
      );
    });

    const deleteButton = this.shadowRoot.querySelector(".deleteButton");
    deleteButton.addEventListener("click", async () => {
      const taskId = this.getAttribute("id");
      try {
        await deleteTask(taskId);
        this.dispatchEvent(
          new CustomEvent("delete-task", {
            detail: {
              id: taskId,
            },
          })
        );
        this.remove(); // Elimina el elemento del DOM
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        this.showError("Error al eliminar la tarea: " + error.message); // Mostrar el mensaje de error
      }
    });
  }

  showError(message) {
    const errorMessage = this.shadowRoot.querySelector("#error-message");
    if (errorMessage) {
      errorMessage.show(message);
    }
  }
}

customElements.define("task-item", TaskItem);
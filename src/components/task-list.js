import { fetchTasks } from "../utils/api.js";
class TaskList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.render();
  }

  async connectedCallback() {
    //await this.loadTasks(); // Cargando tareas al conectar el componente

    // Escuchar al header
    this.addEventListener("show-in-progress", () => this.showInProgress());
    this.addEventListener("show-done", () => this.showDone());
    this.addEventListener("show-both", () => this.showBoth());
  }

  // Llamada a API y agregar a lista
  async loadTasks() {
    try {
      const tasks = await fetchTasks();
      tasks.forEach((task) => {
        const { name, description, completed, id } = task;
        this.addTask(name, description, completed, id);
      });
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          height: calc(100vh - 100px);
          margin: 20px;
          width: calc(100% - 40px);
        }
        .column {
          flex: 1;
          margin: 0 10px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #ffffff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        .column h2 {
          font-size: 20px;
          color: #333;
          margin-bottom: 15px;
          text-align: center;
          flex: 0;
        }
        .column div {
          flex: 1;
          overflow-y: auto;
        }
      </style>
      <div class="container">
        <section class="column" id="inProgressColumn">
          <h2>EN PROGRESO</h2>
          <div id="inProgressTasks"></div>
        </section>
        <section class="column" id="doneColumn">
          <h2>COMPLETADAS</h2>
          <div id="doneTasks"></div>
        </section>
      </div>
    `;
    this.inProgressContainer =
      this.shadowRoot.getElementById("inProgressTasks");
    this.doneContainer = this.shadowRoot.getElementById("doneTasks");
  }

  addTask(name, description, completed, id) {
    const taskItem = document.createElement("task-item");
    taskItem.setAttribute("name", name);
    taskItem.setAttribute("description", description);
    taskItem.setAttribute("completed", completed);
    taskItem.setAttribute("id", id);

    // Agregar la tarea por completed
    if (completed) {
      this.doneContainer.appendChild(taskItem);
    } else {
      this.inProgressContainer.appendChild(taskItem);
    }

    // Agregar eventos para la tarea (Editar, eliminar, terminar)
    taskItem.addEventListener("edit-task", (event) => {
      const taskItem = event.detail.taskItem;
      const editForm = document.createElement("edit-form");
      document.body.appendChild(editForm);
      editForm.open(taskItem);
    });

    taskItem.addEventListener("delete-task", () => {
      taskItem.remove();
    });

    taskItem.addEventListener("task-completed", (event) => {
      if (event.detail.completed) {
        this.completeTask(taskItem);
      } else {
        this.inProgressContainer.appendChild(taskItem);
      }
    });
  }

  completeTask(taskItem) {
    taskItem.setAttribute("completed", "true");
    this.doneContainer.appendChild(taskItem);
  }

  showInProgress() {
    this.inProgressContainer.style.display = "block";
    this.doneContainer.style.display = "none";
  }

  showDone() {
    this.inProgressContainer.style.display = "none";
    this.doneContainer.style.display = "block";
  }

  showBoth() {
    this.inProgressContainer.style.display = "block";
    this.doneContainer.style.display = "block";
  }
}

customElements.define("task-list", TaskList);

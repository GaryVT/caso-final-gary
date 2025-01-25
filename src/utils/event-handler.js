import { fetchTasks, addTask, updateTask, deleteTask } from "./api.js";

export function setupEventHandlers(taskList, taskForm) {
  // Evento para cerrar sesion
  document.querySelector("header-component").addEventListener("logout", () => {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "login.html";
  });

  // Evento para abrir el formulario de agregar tarea
  document
    .querySelector("header-component")
    .addEventListener("add-task", () => {
      taskForm.open();
    });

  // Evento para guardar la tarea
  taskForm.addEventListener("task-saved", async (event) => {
    const { name, description } = event.detail;
    const newTask = await addTask({ name, description, completed: false });
    taskList.addTask(
      newTask.name,
      newTask.description,
      newTask.completed,
      newTask.id
    );
  });

  // Evento para editar la tarea
  taskList.addEventListener("edit-task", async (event) => {
    const { id, name, description } = event.detail;
    const updatedTask = { name, description, completed: false };

    try {
      const task = await updateTask(id, updatedTask);
      taskList.addTask(task.name, task.description, task.completed, task.id);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  });

  // Evento para eliminar la tarea
  taskList.addEventListener("delete-task", async (event) => {
    const { id } = event.detail;
    try {
      await deleteTask(id);
      taskList.removeTask(id);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  });

  // Escuchar eventos para mostrar tareas
  document
    .querySelector("header-component")
    .addEventListener("show-in-progress", () => {
      taskList.showInProgress();
    });

  document
    .querySelector("header-component")
    .addEventListener("show-done", () => {
      taskList.showDone();
    });

  document
    .querySelector("header-component")
    .addEventListener("show-both", () => {
      taskList.showBoth();
    });

  // Cargar las tareas al iniciar
  (async () => {
    const tasks = await fetchTasks();
    tasks.forEach((task) => {
      taskList.addTask(task.name, task.description, task.completed, task.id);
    });
  })();
}

/*
Eventos generales en este manejador de eventos
Eventos propios deu n componente solo va en el mismo componnte
--
carpeta -> rutas, paginas -> llama componentes (anidados, uno llamaa al otro CSS Module), services (dir, cosumo de serv)
*/

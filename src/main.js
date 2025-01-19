import "./components/task-item.js";
import "./components/task-list.js";
import "./components/task-form.js";
import "./components/edit-form.js";
import "./components/header-component.js";
import { setupEventHandlers } from "./utils/event-handler.js";

// El DOM debe estar cargado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario ha iniciado sesion
  if (!sessionStorage.getItem("loggedIn")) {
    window.location.href = "/src/pages/html/login.html"; // Al login si no está autenticado
  }

  // Instancias de componentes
  const taskList = document.querySelector("task-list");
  const taskForm = document.createElement("task-form");
  document.body.appendChild(taskForm);
  const editForm = document.createElement("edit-form");
  document.body.appendChild(editForm);

  // Configurar los eventos
  setupEventHandlers(taskList, taskForm);
});

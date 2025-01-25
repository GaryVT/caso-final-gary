const API_URL = "https://678ade47dd587da7ac2b99f6.mockapi.io/tasks/tasks";

// Obtener tareas
export async function fetchTasks() {
  const response = await fetch(API_URL);
  if (!response.ok) {// tmb validar el status 200, si responde mensage de error
    throw new Error("Error al obtener las tareas");
  }
  const tasks = await response.json();
  return tasks;
}

// Agregar una nueva tarea
export async function addTask(task) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error("Error al agregar la tarea");
  }
  const newTask = await response.json();
  return newTask;
}

// Actualizar una tarea
export async function updateTask(taskId, updatedTask) {

  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });

  if (!response.ok) {
    console.error("Error en la respuesta de la API:", response);
    throw new Error("Error al actualizar la tarea");
  }

  const task = await response.json();
  return task;
}

// Eliminar una tarea
export async function deleteTask(taskId) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la tarea");
  }
}

// Buscar por ID
export async function fetchTaskById(taskId) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Error al buscar la tarea por ID");
  }
}

import { validateCreateTask, validateUpdateTask } from "../validators/taskSchemas.js";

export function createTaskController(taskService) {
  return {
    createTask: async (userId, body) => {
      const errors = validateCreateTask(body);

      if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 400;
        error.details = errors;
        throw error;
      }

      return taskService.createTask(userId, body);
    },

    listTasks: async (userId) => taskService.listTasks(userId),

    updateTask: async (userId, taskId, body) => {
      const errors = validateUpdateTask(body);

      if (errors.length > 0) {
        const error = new Error("Validation failed");
        error.statusCode = 400;
        error.details = errors;
        throw error;
      }

      return taskService.updateTask(userId, taskId, body);
    },

    deleteTask: async (userId, taskId) => taskService.deleteTask(userId, taskId)
  };
}

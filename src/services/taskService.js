import { randomUUID } from "crypto";

export class TaskService {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(userId, input) {
    const now = new Date().toISOString();

    return this.taskRepository.create({
      id: randomUUID(),
      userId,
      title: input.title,
      description: input.description ?? "",
      status: "todo",
      priority: input.priority ?? "medium",
      dueDate: input.dueDate ?? null,
      createdAt: now,
      updatedAt: now
    });
  }

  async listTasks(userId) {
    return this.taskRepository.findAllByUserId(userId);
  }

  async updateTask(userId, taskId, patch) {
    const task = await this.taskRepository.findById(taskId);

    if (!task || task.userId !== userId) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    return this.taskRepository.update(taskId, patch);
  }

  async deleteTask(userId, taskId) {
    const task = await this.taskRepository.findById(taskId);

    if (!task || task.userId !== userId) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    await this.taskRepository.delete(taskId);
  }
}

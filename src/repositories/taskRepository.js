export class TaskRepository {
  constructor(db) {
    this.db = db;
  }

  async create(task) {
    const data = await this.db.read();
    data.tasks.push(task);
    await this.db.write(data);
    return task;
  }

  async findAllByUserId(userId) {
    const data = await this.db.read();
    return data.tasks.filter((task) => task.userId === userId);
  }

  async findById(taskId) {
    const data = await this.db.read();
    return data.tasks.find((task) => task.id === taskId) || null;
  }

  async update(taskId, patch) {
    const data = await this.db.read();
    const index = data.tasks.findIndex((task) => task.id === taskId);

    if (index === -1) {
      return null;
    }

    data.tasks[index] = {
      ...data.tasks[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };

    await this.db.write(data);
    return data.tasks[index];
  }

  async delete(taskId) {
    const data = await this.db.read();
    const index = data.tasks.findIndex((task) => task.id === taskId);

    if (index === -1) {
      return false;
    }

    data.tasks.splice(index, 1);
    await this.db.write(data);
    return true;
  }
}

// Repository Pattern:
// Controllers/services ask this repository for user data.
// Benefit: If later you switch from file DB to PostgreSQL, service code stays nearly same.

export class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async create(user) {
    const data = await this.db.read();
    data.users.push(user);
    await this.db.write(data);
    return user;
  }

  async findByEmail(email) {
    const data = await this.db.read();
    return data.users.find((user) => user.email === email) || null;
  }

  async findById(id) {
    const data = await this.db.read();
    return data.users.find((user) => user.id === id) || null;
  }
}

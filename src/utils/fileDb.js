import { promises as fs } from "fs";
import path from "path";

// Tiny file-based DB helper.
// This is NOT for high-scale production, but it is perfect for learning core backend patterns
// without needing Docker/database setup on day one.
export class FileDb {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async read() {
    const absolutePath = path.resolve(this.filePath);
    const text = await fs.readFile(absolutePath, "utf8");
    return JSON.parse(text);
  }

  async write(data) {
    const absolutePath = path.resolve(this.filePath);
    await fs.writeFile(absolutePath, JSON.stringify(data, null, 2));
  }
}

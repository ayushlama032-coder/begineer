import { FileDb } from "./utils/fileDb.js";
import { env } from "./config/env.js";
import { UserRepository } from "./repositories/userRepository.js";
import { TaskRepository } from "./repositories/taskRepository.js";
import { AuthService } from "./services/authService.js";
import { TaskService } from "./services/taskService.js";
import { createAuthController } from "./controllers/authController.js";
import { createTaskController } from "./controllers/taskController.js";
import { json, readJsonBody } from "./utils/http.js";

function readBearerToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Missing or invalid Authorization header");
    error.statusCode = 401;
    throw error;
  }

  return authHeader.replace("Bearer ", "").trim();
}

export function createApp() {
  const db = new FileDb(env.DATA_FILE);
  const userRepository = new UserRepository(db);
  const taskRepository = new TaskRepository(db);
  const authService = new AuthService(userRepository, env.JWT_SECRET);
  const taskService = new TaskService(taskRepository);
  const authController = createAuthController(authService);
  const taskController = createTaskController(taskService);

  return async function app(req, res) {
    try {
      const url = new URL(req.url, "http://localhost");

      if (req.method === "GET" && url.pathname === "/health") {
        return json(res, 200, { status: "ok" });
      }

      if (req.method === "POST" && url.pathname === "/api/auth/register") {
        const body = await readJsonBody(req);
        const result = await authController.register(body);
        return json(res, 201, result);
      }

      if (req.method === "POST" && url.pathname === "/api/auth/login") {
        const body = await readJsonBody(req);
        const result = await authController.login(body);
        return json(res, 200, result);
      }

      if (url.pathname === "/api/tasks" && req.method === "GET") {
        const token = readBearerToken(req);
        const user = authService.verifyToken(token);
        const tasks = await taskController.listTasks(user.sub);
        return json(res, 200, tasks);
      }

      if (url.pathname === "/api/tasks" && req.method === "POST") {
        const token = readBearerToken(req);
        const user = authService.verifyToken(token);
        const body = await readJsonBody(req);
        const task = await taskController.createTask(user.sub, body);
        return json(res, 201, task);
      }

      if (url.pathname.startsWith("/api/tasks/") && req.method === "PATCH") {
        const taskId = url.pathname.split("/")[3];
        const token = readBearerToken(req);
        const user = authService.verifyToken(token);
        const body = await readJsonBody(req);
        const task = await taskController.updateTask(user.sub, taskId, body);
        return json(res, 200, task);
      }

      if (url.pathname.startsWith("/api/tasks/") && req.method === "DELETE") {
        const taskId = url.pathname.split("/")[3];
        const token = readBearerToken(req);
        const user = authService.verifyToken(token);
        await taskController.deleteTask(user.sub, taskId);
        res.writeHead(204);
        return res.end();
      }

      return json(res, 404, { message: "Route not found" });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const payload = { message: error.message || "Internal Server Error" };

      if (error.details) {
        payload.details = error.details;
      }

      return json(res, statusCode, payload);
    }
  };
}

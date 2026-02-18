import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

async function createTestServer() {
  const dir = await mkdtemp(path.join(tmpdir(), "backend-learning-"));
  const dataFile = path.join(dir, "test-db.json");
  await writeFile(dataFile, JSON.stringify({ users: [], tasks: [] }, null, 2));

  process.env.DATA_FILE = dataFile;
  process.env.JWT_SECRET = "test-secret";

  const { createApp } = await import(`../src/app.js?cacheBust=${Date.now()}`);
  const app = createApp();
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`
  };
}

test("health endpoint works", async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "ok");
  } finally {
    server.close();
  }
});

test("register -> login -> create task -> list tasks flow", async () => {
  const { server, baseUrl } = await createTestServer();

  try {
    const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Beginner Dev",
        email: "beginner@example.com",
        password: "123456"
      })
    });

    const registerBody = await registerRes.json();
    assert.equal(registerRes.status, 201);
    assert.ok(registerBody.token);

    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "beginner@example.com",
        password: "123456"
      })
    });

    const loginBody = await loginRes.json();
    assert.equal(loginRes.status, 200);

    const createTaskRes = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginBody.token}`
      },
      body: JSON.stringify({
        title: "Learn backend",
        description: "Understand patterns"
      })
    });

    const createTaskBody = await createTaskRes.json();
    assert.equal(createTaskRes.status, 201);
    assert.equal(createTaskBody.title, "Learn backend");

    const listTasksRes = await fetch(`${baseUrl}/api/tasks`, {
      headers: { Authorization: `Bearer ${loginBody.token}` }
    });

    const listTasksBody = await listTasksRes.json();
    assert.equal(listTasksRes.status, 200);
    assert.equal(listTasksBody.length, 1);
  } finally {
    server.close();
  }
});

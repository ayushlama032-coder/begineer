import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

http.createServer(app).listen(env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${env.PORT}`);
});

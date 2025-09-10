import express from "express";
import cors from "cors";
import { testConnection } from "./config/db";
import config from "./config/index";
import routes from "./routes";
import { connectRedis } from "./config/redis";
import cookieParser from "cookie-parser";
import http from "http";
import { startSignalingServer } from "./websocket/signaling.server";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const startServer = async () => {
  try {
    await testConnection();
    await connectRedis();
    app.use("/api", routes);

    // ✅ Create HTTP server and bind both Express + WS
    const server = http.createServer(app);

    // ✅ Start WebSocket signaling server
    startSignalingServer(server);

    // ✅ Start HTTP+WS server
    server.listen(config.APP_PORT, () => {
      console.log(`🚀 Server running on http://localhost:${config.APP_PORT}`);
      console.log(`📡 WebSocket signaling server running on ws://localhost:${config.APP_PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

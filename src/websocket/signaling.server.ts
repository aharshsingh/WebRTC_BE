import WebSocket, { WebSocketServer } from "ws";
import jwt from "../services/jwt";
import redisClient from "../config/redis";

interface Client {
  userId: string;
  sessionId: string;
  socket: WebSocket;
}

const clients: Record<string, Client> = {};

export function startSignalingServer(server: any) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
    const token = new URL(req.url!, "http://localhost").searchParams.get("token");

    if (!token) {
      ws.close(4001, "Token missing");
      return;
    }

    try {
      const payload: any = jwt.verifyToken(token);

      const redisKey = `accessToken:${token}`;
      const tokenData = await redisClient.get(redisKey);

      if (!tokenData) {
        ws.close(4002, "Invalid or expired token");
        return;
      }

      const parsed = JSON.parse(tokenData);
      if (parsed.isRevoked) {
        ws.close(4002, "Revoked token");
        return;
      }

      const clientKey = `${payload.sessionId}:${payload.userId}`;
      clients[clientKey] = { userId: payload.userId, sessionId: payload.sessionId, socket: ws };

      console.log(`Client ${clientKey} connected`);

      ws.on("message", (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          handleSignalMessage(payload.sessionId, payload.userId, data);
        } catch (err) {
          console.error("Invalid message:", msg.toString());
        }
      });

      ws.on("close", () => {
        delete clients[clientKey];
        console.log(`Client ${clientKey} disconnected`);
      });
    } catch (err) {
      console.error("Auth failed:", err);
      ws.close(4003, "Auth failed");
    }
  });
}

function handleSignalMessage(sessionId: string, senderId: string, data: any) {
  const { targetUserId, type, payload } = data;
  console.log(`Signal message from ${senderId} to ${targetUserId}:`, type);

  const targetKey = `${sessionId}:${targetUserId}`;
  if (clients[targetKey]) {
    clients[targetKey].socket.send(
      JSON.stringify({ from: senderId, type, payload })
    );
  } else {
    console.log(`Target ${targetUserId} not connected yet.`);
  }
}

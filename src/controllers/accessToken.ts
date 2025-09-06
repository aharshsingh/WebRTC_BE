import { Request, Response } from "express";
import jwt from "../services/jwt";
import redisClient from "../config/redis";

export const TokenController = {
  // Issue token for a participant
  issueToken: async (req: Request, res: Response) => {
    const { userId, sessionId, expiresIn = "1h" } = req.body;

    try {
      // Create JWT
      const token = jwt.registerAccessToken({ userId, sessionId }, expiresIn);

      // Convert expiresIn ("1h", "30m") -> seconds
      const ttl =
        expiresIn.endsWith("h")
          ? parseInt(expiresIn) * 3600
          : expiresIn.endsWith("m")
          ? parseInt(expiresIn) * 60
          : 3600; // default 1h

      // Save token in Redis (use token as key or tokenId as key)
      await redisClient.setEx(
        `accessToken:${token}`, // key
        ttl,                     // TTL in seconds
        JSON.stringify({ userId, sessionId })
      );

      res.json({ token, expiresIn });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to issue token" });
    }
  },

  // Revoke token
  revokeToken: async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
      // Remove from Redis
      const result = await redisClient.del(`accessToken:${token}`);

      if (result === 0) {
        return res.status(404).json({ error: "Token not found" });
      }

      res.json({ success: true, revoked: token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to revoke token" });
    }
  },

  // Validate token
  validateToken: async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
      const data = await redisClient.get(`accessToken:${token}`);

      if (!data) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      res.json({ valid: true, data: JSON.parse(data) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to validate token" });
    }
  },
};

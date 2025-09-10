import { NextFunction, Request, Response } from "express";
import jwt from "../services/jwt";
import redisClient from "../config/redis";
import { sendResponse } from "../utils/response";

const TokenController = {
  // Issue token for a participant
   async issueToken (req: Request, res: Response, next: NextFunction) {
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

      sendResponse(res, "Token generated successfully", { token, expiresIn }, "CREATED");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  // Revoke token
  async revokeToken (req: Request, res: Response, next: NextFunction) {
    const { token } = req.params;

    try {
      // Remove from Redis
      const result = await redisClient.del(`accessToken:${token}`);

      if (result === 0) {
        res.status(404).json({ error: "Token not found" });
      }

      sendResponse(res, "Token revoked successfully", { success: true, revoked: token }, "UPDATED");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

  // Validate token
  async validateToken (req: Request, res: Response, next: NextFunction) {
    const { token } = req.body;

    try {
      const data = await redisClient.get(`accessToken:${token}`);

      if (!data) {
        res.status(401).json({ error: "Invalid or expired token" });
      }

      sendResponse(res, "Token is valid", { valid: true, data: JSON.parse(data || "") }, "SUCCESS");
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
};

export default TokenController;

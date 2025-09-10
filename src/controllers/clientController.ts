import { Request, Response, NextFunction } from "express";
import { db } from "../config/db";
import { sessions, users } from "../db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import jwt from "../services/jwt";
import redisClient from "../config/redis";
import { sendResponse } from "../utils/response";

export const clientController = {
  createFullSession: async (req: Request, res: Response, next: NextFunction) => {
    const { org, createdBy, type, clientExpiresIn = "1h" } = req.body;

    try {
      // 1️⃣ Create session
      const [newSession] = await db
        .insert(sessions)
        .values({
          id: uuidv4(),
          org,
          createdBy,
          type,
          status: "pending",
        })
        .returning();

      // 2️⃣ Create external user
      const [newUser] = await db
        .insert(users)
        .values({
          role: "external",
          status: "pending",
        })
        .returning();

      // 3️⃣ Add external user to session participants
      const [updatedSession] = await db
        .update(sessions)
        .set({
          participants: [
            ...(Array.isArray(newSession.participants) ? newSession.participants : []),
            newUser.id,
          ],
        })
        .where(eq(sessions.id, newSession.id))
        .returning();

      // 4️⃣ Generate token for client
      const clientToken = jwt.registerAccessToken(
        { userId: createdBy, sessionId: newSession.id },
        clientExpiresIn
      );

      const clientTTL =
        clientExpiresIn.endsWith("h")
          ? parseInt(clientExpiresIn) * 3600
          : clientExpiresIn.endsWith("m")
          ? parseInt(clientExpiresIn) * 60
          : 3600;

      await redisClient.setEx(
        `accessToken:${clientToken}`,
        clientTTL,
        JSON.stringify({ userId: createdBy, sessionId: newSession.id })
      );

      // 5️⃣ Generate token for external user
      const externalExpiresIn = "1h"; // default or configurable
      const externalToken = jwt.registerAccessToken(
        { userId: newUser.id, sessionId: newSession.id },
        externalExpiresIn
      );

      const externalTTL =
        externalExpiresIn.endsWith("h")
          ? parseInt(externalExpiresIn) * 3600
          : externalExpiresIn.endsWith("m")
          ? parseInt(externalExpiresIn) * 60
          : 3600;

      await redisClient.setEx(
        `accessToken:${externalToken}`,
        externalTTL,
        JSON.stringify({ userId: newUser.id, sessionId: newSession.id })
      );

      // ✅ Send final response
      sendResponse(
        res,
        "Session created successfully",
        {
          session: updatedSession,
          client: { token: clientToken, expiresIn: clientExpiresIn },
          externalUser: { ...newUser, token: externalToken, expiresIn: externalExpiresIn },
        },
        "CREATED"
      );
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
};


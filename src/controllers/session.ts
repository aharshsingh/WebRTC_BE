import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";
import { sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const SessionController = {
    createSession: async (req: Request, res: Response, next: NextFunction) => {
        const { org, createdBy, type } = req.body;

        try {
            const newSession = await db.insert(sessions).values({
                id: uuidv4(),
                org,
                createdBy,
                type,
                status: "pending",
            }).returning();

            res.json(newSession[0]);
        } catch (err) {
            return next(err);
        }
    },

    updateSession: async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId } = req.params;
        const { status, participantId } = req.body;

        try {
            // Fetch current session
            const [existingSession] = await db
                .select()
                .from(sessions)
                .where(eq(sessions.id, sessionId));

            if (!existingSession) {
                return res.status(404).json({ error: "Session not found" });
            }

            // Start with old values
            const updates: any = {};

            // Update status if provided
            if (status) {
                updates.status = status;
            }

            // Add participant if provided
            if (participantId) {
                const currentParticipants = Array.isArray(existingSession.participants)
                    ? existingSession.participants
                    : [];

                updates.participants = [...currentParticipants, participantId];
            }

            // Perform update
            const [updated] = await db
                .update(sessions)
                .set(updates)
                .where(eq(sessions.id, sessionId))
                .returning();

            res.json(updated);
        } catch (err) {
            console.error(err);
            return next(err);
        }
    },

    getSessionById: async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId } = req.params;

        try {

            const session = await db
                .select()
                .from(sessions)
                .where(eq(sessions.id, sessionId));
            if (!session.length) return res.status(404).json({ error: "Session not found" });

            res.json(session[0]);
        } catch (err) {
            return next(err);
        }
    },
};

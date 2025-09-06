import { Request, Response } from "express";
import { db } from "../config/db";
import { sessions } from "../db/schema";
import { eq } from "drizzle-orm";

export const SessionController = {
    createSession: async (req: Request, res: Response) => {
        const { orgId, createdBy, participantIds, type } = req.body;

        try {
            const newSession = await db.insert(sessions).values({
                orgId,
                createdBy,
                participants: participantIds,
                type,
                status: "pending",
            }).returning();

            res.json(newSession[0]);
        } catch (err) {
            res.status(500).json({ error: "Failed to create session" });
        }
    },

    updateSessionStatus: async (req: Request, res: Response) => {
        const { sessionId } = req.params;
        const { status } = req.body;

        try {

            const updated = await db
                .update(sessions)
                .set({ status })
                .where(eq(sessions.id, Number(sessionId)))
                .returning();
            res.json(updated[0]);
        } catch (err) {
            res.status(500).json({ error: "Failed to update session" });
        }
    },

    getSessionById: async (req: Request, res: Response) => {
        const { sessionId } = req.params;

        try {

            const session = await db
                .select()
                .from(sessions)
                .where(eq(sessions.id, Number(sessionId)));
            if (!session.length) return res.status(404).json({ error: "Session not found" });

            res.json(session[0]);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch session" });
        }
    },
};

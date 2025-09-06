import { Request, Response } from "express";
import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const UserController = {
    // Create internal user
    createInternalUser: async (req: Request, res: Response) => {
        const { orgId, name, email, phone, role } = req.body;

        try {
            const newUser = await db.insert(users).values({
                orgId,
                name,
                email,
                phone,
                role,
                status: "active",
            }).returning();

            res.json(newUser[0]);
        } catch (err) {
            res.status(500).json({ error: "Failed to create user" });
        }
    },

    // Create external user (placeholder)
    createExternalUser: async (req: Request, res: Response) => {
        const { name, email, phone } = req.body;

        try {
            const newUser = await db.insert(users).values({
                name,
                email,
                phone,
                role: "external",
                status: "pending",
            }).returning();

            res.json(newUser[0]);
        } catch (err) {
            res.status(500).json({ error: "Failed to create external user" });
        }
    },

    // Get user by ID
    getUserById: async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.id, id));
            if (!user.length) return res.status(404).json({ error: "User not found" });

            res.json(user[0]);
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch user" });
        }
    },
};

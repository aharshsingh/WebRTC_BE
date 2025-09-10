import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendResponse } from "../utils/response";

const UserController = {
    // Create internal user
    createInternalUser: async (req: Request, res: Response, next: NextFunction) => {
        const { org, name, email, phone, role } = req.body;

        try {
            const newUser = await db.insert(users).values({
                org,
                name,
                email,
                phone,
                role,
                status: "active",
            }).returning();

            res.json(newUser[0]);
            sendResponse(res, "Internal user created successfully", newUser[0], "CREATED");
        } catch (err) {
            return next(err);
        }
    },

    // Create external user (placeholder)
    createExternalUser: async (req: Request, res: Response, next: NextFunction) => {
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
            sendResponse(res, "External user created successfully", newUser[0], "CREATED");
        } catch (err) {
            return next(err);
        }
    },

    // Get user by ID
    getUserById: async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        try {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.id, id));
            if (!user.length) res.status(404).json({ error: "User not found" });

            res.json(user[0]);
            sendResponse(res, "Fetched user", user[0], "SUCCESS");
        } catch (err) {
            return next(err);
        }
    },
};

export default UserController;
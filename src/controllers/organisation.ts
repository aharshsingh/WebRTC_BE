// src/controllers/organisationController.ts
import { NextFunction, Request, Response } from "express";
import { db } from "../config/db"; // adjust to your db instance path
import { organisations } from "../db/schema/organisation";
import { v4 as uuidv4 } from "uuid";
import { sendResponse } from "../utils/response";

const OrganisationController = {
  // Save organisation
  createOrganisation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, domain, settings } = req.body;

      if (!name || !domain) {
        res.status(400).json({ error: "Name and domain are required" });
      }

      const [org] = await db
        .insert(organisations)
        .values({
          id: uuidv4(), // generate UUID
          name,
          domain,
          settings: settings || {},
        })
        .returning();
      sendResponse(res, "Organisation added successfully", org, "CREATED");
    } catch (error) {
      console.error("Error creating organisation:", error);
      return next(error);
    }
  },
};

export default OrganisationController;
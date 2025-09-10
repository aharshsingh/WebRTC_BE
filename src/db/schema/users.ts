import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { organisations } from "./organisation";

export const userRoles = pgEnum("user_roles", ["agent", "admin", "external"]);
export const userStatuses = pgEnum("user_statuses", ["active", "pending", "inactive"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  org: uuid("org")
    .references(() => organisations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: userRoles("role").notNull().default("external"),
  status: userStatuses("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

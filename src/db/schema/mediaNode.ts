import { pgTable, varchar, integer, uuid } from "drizzle-orm/pg-core";

// Enum for status
export const nodeStatusEnum = ["active", "inactive", "maintenance"] as const;

export const nodes = pgTable("nodes", {
  id: uuid("id").primaryKey(),
  ip: varchar("ip", { length: 50 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  capacity: integer("capacity").notNull(), // max concurrent sessions
  status: varchar("status", { length: 50 }).default("active").notNull(), // active, inactive, maintenance
  currentLoad: integer("current_load").default(0).notNull(), // current active sessions
});

import { pgTable, serial, integer, jsonb, integer as intColumn, varchar, timestamp } from "drizzle-orm/pg-core";
import { sessions } from "./session";

export const sessionLogs = pgTable("session_logs", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  participants: jsonb("participants").default([]), // JSON array of participant details
  duration: intColumn("duration").notNull(), // duration in seconds
  networkStats: jsonb("network_stats").default({}), // JSON object for network statistics
  disconnectReason: varchar("disconnect_reason", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

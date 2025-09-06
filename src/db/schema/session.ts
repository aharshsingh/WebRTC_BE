import { pgTable, serial, integer, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { organisations } from "./organisation";
import { users } from "./users";

export const sessionTypeEnum = ["kyc", "interview", "consult", "support"] as const;
export const sessionStatusEnum = ["pending", "active", "completed", "failed"] as const;

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id")
    .notNull()
    .references(() => organisations.id, { onDelete: "cascade" }),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  participants: jsonb("participants").default([]),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // enum
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
});

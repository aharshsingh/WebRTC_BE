import { pgTable, jsonb, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { organisations } from "./organisation";
import { users } from "./users";

export const sessionTypeEnum = pgEnum("session_type", ["kyc", "interview", "consult", "support"]);
export const sessionStatusEnum = pgEnum("session_status", ["pending", "active", "completed", "failed"]);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey(),
  org: uuid("org")
    .notNull()
    .references(() => organisations.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  participants: jsonb("participants").default([]),
  type: sessionTypeEnum("type").notNull(),
  status: sessionStatusEnum("status").default("pending").notNull(),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
});

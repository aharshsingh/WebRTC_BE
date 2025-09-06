import { pgTable, serial, integer, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { organisations } from "./organisation";
import { users } from "./users";

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  orgId: integer("org_id")
    .notNull()
    .references(() => organisations.id, { onDelete: "cascade" }),
  actorId: integer("actor_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(), // e.g., create, update, delete
  entity: varchar("entity", { length: 100 }).notNull(), // e.g., user, session, node
  entityId: integer("entity_id").notNull(), // ID of the entity acted upon
  metadata: jsonb("metadata").default({}), // extra details about the action
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

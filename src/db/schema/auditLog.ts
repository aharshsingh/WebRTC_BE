import { pgTable, integer, varchar, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { organisations } from "./organisation";
import { users } from "./users";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey(),
  org: uuid("id")
    .notNull()
    .references(() => organisations.id, { onDelete: "cascade" }),
  actorId: uuid("actor_id")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(), // e.g., create, update, delete
  entity: varchar("entity", { length: 100 }).notNull(), // e.g., user, session, node
  entityId: integer("entity_id").notNull(), // ID of the entity acted upon
  metadata: jsonb("metadata").default({}), // extra details about the action
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

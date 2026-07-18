import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const demoUsers = pgTable("demo_users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DemoUser = typeof demoUsers.$inferSelect;
export type NewDemoUser = typeof demoUsers.$inferInsert;

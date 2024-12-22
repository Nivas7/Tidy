import {
  pgEnum,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const statusEnum = pgEnum("status", [
  "pending",
  "in_progress",
  "completed",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const todo = pgTable("todo", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: statusEnum("status").default("pending"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const todoRelations = relations(todo, ({ one }) => ({
  user: one(users, {
    fields: [todo.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  todo: many(todo),
}));

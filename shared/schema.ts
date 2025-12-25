import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Students/Participants in the challenge
export const students = pgTable("students", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  photoUrl: text("photo_url"),
  voteCount: integer("vote_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  voteCount: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Voters who can vote
export const voters = pgTable("voters", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  hasVoted: boolean("has_voted").notNull().default(false),
  votedForId: varchar("voted_for_id", { length: 36 }),
});

export const insertVoterSchema = createInsertSchema(voters).omit({
  id: true,
  hasVoted: true,
  votedForId: true,
});

export type InsertVoter = z.infer<typeof insertVoterSchema>;
export type Voter = typeof voters.$inferSelect;

// Votes record
export const votes = pgTable("votes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  voterId: varchar("voter_id", { length: 36 }).notNull(),
  studentId: varchar("student_id", { length: 36 }).notNull(),
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
});

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

// Admin credentials (from environment variables)
export const adminCredentials = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

// Legacy user table (keeping for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

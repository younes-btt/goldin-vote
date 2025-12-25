import { 
  students, voters, votes,
  type Student, type InsertStudent,
  type Voter, type InsertVoter,
  type Vote, type InsertVote,
  type User, type InsertUser,
  users
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Students
  getAllStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  deleteStudent(id: string): Promise<void>;
  incrementVoteCount(id: string): Promise<Student | undefined>;

  // Voters
  getAllVoters(): Promise<Voter[]>;
  getVoter(id: string): Promise<Voter | undefined>;
  getVoterByEmail(email: string): Promise<Voter | undefined>;
  createVoter(voter: InsertVoter): Promise<Voter>;
  markVoterAsVoted(voterId: string, studentId: string): Promise<Voter | undefined>;

  // Votes
  createVote(vote: InsertVote): Promise<Vote>;
  getVoteByVoterId(voterId: string): Promise<Vote | undefined>;

  // Legacy user methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Students
  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students).orderBy(desc(students.voteCount));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const [student] = await db
      .insert(students)
      .values({ ...insertStudent, id, voteCount: 0 })
      .returning();
    return student;
  }

  async deleteStudent(id: string): Promise<void> {
    await db.delete(students).where(eq(students.id, id));
  }

  async incrementVoteCount(id: string): Promise<Student | undefined> {
    const student = await this.getStudent(id);
    if (!student) return undefined;
    
    const [updated] = await db
      .update(students)
      .set({ voteCount: student.voteCount + 1 })
      .where(eq(students.id, id))
      .returning();
    return updated;
  }

  // Voters
  async getAllVoters(): Promise<Voter[]> {
    return await db.select().from(voters);
  }

  async getVoter(id: string): Promise<Voter | undefined> {
    const [voter] = await db.select().from(voters).where(eq(voters.id, id));
    return voter || undefined;
  }

  async getVoterByEmail(email: string): Promise<Voter | undefined> {
    const [voter] = await db.select().from(voters).where(eq(voters.email, email));
    return voter || undefined;
  }

  async createVoter(insertVoter: InsertVoter): Promise<Voter> {
    const id = randomUUID();
    const [voter] = await db
      .insert(voters)
      .values({ ...insertVoter, id, hasVoted: false, votedForId: null })
      .returning();
    return voter;
  }

  async markVoterAsVoted(voterId: string, studentId: string): Promise<Voter | undefined> {
    const [voter] = await db
      .update(voters)
      .set({ hasVoted: true, votedForId: studentId })
      .where(eq(voters.id, voterId))
      .returning();
    return voter;
  }

  // Votes
  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const [vote] = await db
      .insert(votes)
      .values({ ...insertVote, id })
      .returning();
    return vote;
  }

  async getVoteByVoterId(voterId: string): Promise<Vote | undefined> {
    const [vote] = await db.select().from(votes).where(eq(votes.voterId, voterId));
    return vote || undefined;
  }

  // Legacy user methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, id })
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertVoterSchema, adminCredentials } from "@shared/schema";
import { z } from "zod";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized - Admin access required" });
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);
  
  // ==================== STUDENTS ====================
  
  // Get all students
  app.get("/api/students", async (_req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get single student
  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  // Create student (submit entry)
  app.post("/api/students", async (req, res) => {
    try {
      const parsed = insertStudentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid student data", errors: parsed.error.errors });
      }
      const student = await storage.createStudent(parsed.data);
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ message: "Failed to create student" });
    }
  });

  // Delete student (admin only)
  app.delete("/api/students/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteStudent(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete student" });
    }
  });

  // ==================== VOTERS ====================

  // Get all voters (admin only)
  app.get("/api/voters", requireAdmin, async (_req, res) => {
    try {
      const voters = await storage.getAllVoters();
      res.json(voters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch voters" });
    }
  });

  // Register voter
  app.post("/api/voters", async (req, res) => {
    try {
      const parsed = insertVoterSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid voter data", errors: parsed.error.errors });
      }

      // Check if email already exists
      const existingVoter = await storage.getVoterByEmail(parsed.data.email);
      if (existingVoter) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const voter = await storage.createVoter(parsed.data);
      res.status(201).json(voter);
    } catch (error) {
      res.status(500).json({ message: "Failed to register voter" });
    }
  });

  // Login voter (by email)
  app.post("/api/voters/login", async (req, res) => {
    try {
      const schema = z.object({ email: z.string().email() });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid email" });
      }

      const voter = await storage.getVoterByEmail(parsed.data.email);
      if (!voter) {
        return res.status(404).json({ message: "Email not found. Please register first." });
      }

      res.json(voter);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // ==================== VOTES ====================

  // Cast vote
  app.post("/api/votes", async (req, res) => {
    try {
      const schema = z.object({
        voterId: z.string(),
        studentId: z.string(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid vote data" });
      }

      const { voterId, studentId } = parsed.data;

      // Check if voter exists
      const voter = await storage.getVoter(voterId);
      if (!voter) {
        return res.status(404).json({ message: "Voter not found" });
      }

      // Check if voter has already voted
      if (voter.hasVoted) {
        return res.status(409).json({ message: "You have already voted" });
      }

      // Check if student exists
      const student = await storage.getStudent(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Create vote record
      await storage.createVote({ voterId, studentId });

      // Update voter status
      const updatedVoter = await storage.markVoterAsVoted(voterId, studentId);

      // Increment student vote count
      const updatedStudent = await storage.incrementVoteCount(studentId);

      res.status(201).json({ 
        voter: updatedVoter, 
        student: updatedStudent 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to cast vote" });
    }
  });

  // ==================== ADMIN ====================

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const schema = z.object({
        username: z.string(),
        password: z.string(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const { username, password } = parsed.data;

      const adminUsername = process.env.ADMIN_USERNAME || "admin";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

      if (username === adminUsername && password === adminPassword) {
        req.session.isAdmin = true;
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  return httpServer;
}

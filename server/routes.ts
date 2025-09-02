import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import multer from "multer";
import { analyzeTextWithGemini, answerQuestionFromText } from "./services/gemini";
import { textInputSchema, questionInputSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only TXT, PDF, DOC, and DOCX files are allowed.'));
      }
    },
  });
  // Analyze text endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = textInputSchema.parse(req.body);
      
      const result = await analyzeTextWithGemini(text);
      
      res.json(result);
    } catch (error) {
      console.error("Error in /api/analyze:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze text" 
      });
    }
  });

  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      const result = await analyzeTextWithGemini(fileContent);
      
      res.json({
        ...result,
        originalText: fileContent,
        fileName: req.file.originalname
      });
    } catch (error) {
      console.error("Error in /api/upload:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process file" 
      });
    }
  });

  // Ask question endpoint
  app.post("/api/ask", async (req, res) => {
    try {
      const { originalText, question, allowRelatedQuestions } = questionInputSchema.parse(req.body);
      
      const answer = await answerQuestionFromText(originalText, question, allowRelatedQuestions);
      
      res.json({ answer });
    } catch (error) {
      console.error("Error in /api/ask:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to answer question" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

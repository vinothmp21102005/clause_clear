import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { analyzeTextWithGemini, answerQuestionFromText } from "./services/gemini";
import { textInputSchema, questionInputSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Ask question endpoint
  app.post("/api/ask", async (req, res) => {
    try {
      const { originalText, question } = questionInputSchema.parse(req.body);
      
      const answer = await answerQuestionFromText(originalText, question);
      
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

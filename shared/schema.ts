import { z } from "zod";

// Text analysis schemas
export const textInputSchema = z.object({
  text: z.string().min(1, "Text is required").max(200000, "Text is too long (max 200,000 characters)"),
});

export const analysisResultSchema = z.object({
  summary: z.string(),
  keyPoints: z.array(z.string()),
});

export const questionInputSchema = z.object({
  originalText: z.string().min(1, "Original text is required").max(200000, "Original text is too long (max 200,000 characters)"),
  question: z.string().min(1, "Question is required"),
  allowRelatedQuestions: z.boolean().optional().default(true),
});

export const answerResultSchema = z.object({
  answer: z.string(),
});

// Types
export type TextInput = z.infer<typeof textInputSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type QuestionInput = z.infer<typeof questionInputSchema>;

// File upload schema
export const fileUploadSchema = z.object({
  file: z.any(), // File object from form data
  type: z.enum(["txt", "pdf", "doc", "docx"]).optional(),
});

export type FileUpload = z.infer<typeof fileUploadSchema>;
export type AnswerResult = z.infer<typeof answerResultSchema>;

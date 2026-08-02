import "server-only";
import { z } from "zod";
import { ValidationError } from "./errors";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createResumeSchema = z.object({
  originalName: z.string().min(1).max(255),
  fileName: z.string().min(1).max(500).optional(),
  fileSize: z.number().int().nonnegative().max(5 * 1024 * 1024),
  mimeType: z.string().default("application/pdf"),
  template: z.string().max(50).default("modern"),
  extractedText: z
    .string()
    .min(1, "Could not extract any text from this PDF")
    .max(500000),
});

export const analyzeSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  jobDescription: z.string().max(30000).optional(),
});

export const rewriteSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  section: z.string().min(1, "Section is required").max(100),
  instructions: z.string().max(2000).default(""),
});

export const coverLetterSchema = z.object({
  resumeId: z.string().min(1, "Resume ID is required"),
  jobTitle: z.string().min(1, "Job title is required").max(200),
  companyName: z.string().min(1, "Company name is required").max(200),
  jobDescription: z.string().max(30000).optional(),
});

export const shareSchema = z.object({
  analysisId: z.string().min(1, "Analysis ID is required"),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

export const sendReportSchema = z.object({
  analysisId: z.string().min(1, "Analysis ID is required"),
  email: z.string().email("Invalid email address"),
});

export const updateRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export function parseBody<S extends z.ZodTypeAny>(body: unknown, schema: S): z.infer<S> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message || "Validation failed");
  }
  return result.data;
}

import { z } from "zod";

export const analyzeSchema = z.object({
  body: z.object({
    resumeId: z.string().min(1, "Resume ID is required"),
    jobDescription: z.string().optional(),
  }),
});

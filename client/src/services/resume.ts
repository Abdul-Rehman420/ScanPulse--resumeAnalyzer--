import api from "./api";
import { Resume, DashboardStats } from "@/types";
import { extractTextFromPdf, isPdfFile } from "@/utils/pdf";
import { uploadResumeFile, deleteResumeFile } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

export const resumeService = {
  async upload(
    file: File,
    template = "modern",
    onProgress?: (percent: number, stage: string) => void
  ): Promise<Resume> {
    onProgress?.(10, "Validating file...");

    if (!(await isPdfFile(file))) {
      throw new Error("Invalid PDF file");
    }

    onProgress?.(30, "Extracting text...");
    const extractedText = await extractTextFromPdf(file);
    if (!extractedText.trim()) {
      throw new Error("Could not extract any text from this PDF");
    }

    onProgress?.(55, "Uploading file...");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("No active session");
    const storagePath = await uploadResumeFile(session.user.id, file);

    onProgress?.(75, "Saving resume...");
    const resume = await api.post<Resume>("/resume", {
      originalName: file.name,
      fileName: storagePath,
      fileSize: file.size,
      mimeType: "application/pdf",
      template,
      extractedText,
    });

    onProgress?.(90, "Saved");
    return resume;
  },

  async getAll() {
    return api.get<Resume[]>("/resume");
  },

  async getById(id: string) {
    return api.get<Resume>(`/resume/${id}`);
  },

  async delete(id: string) {
    const resume = await this.getById(id).catch(() => null);
    const result = await api.del<{ message: string }>(`/resume/${id}`);
    if (resume?.fileName) {
      try {
        await deleteResumeFile(resume.fileName);
      } catch {
        // storage cleanup failure is non-fatal
      }
    }
    return result;
  },

  async getDashboardStats() {
    return api.get<DashboardStats>("/resume/dashboard");
  },
};

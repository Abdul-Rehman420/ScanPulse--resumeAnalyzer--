import api from "./api";
import { Analysis } from "@/types";

export const analysisService = {
  async create(resumeId: string, jobDescription?: string) {
    return api.post<Analysis>("/analyze", {
      resumeId,
      jobDescription: jobDescription || undefined,
    });
  },

  async getById(id: string) {
    return api.get<Analysis>(`/analyze/${id}`);
  },

  async getAll() {
    return api.get<Analysis[]>("/analyze");
  },
};

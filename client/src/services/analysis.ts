import api from "./api";
import { ApiResponse, Analysis } from "@/types";

export const analysisService = {
  async create(resumeId: string, jobDescription?: string) {
    const { data } = await api.post<ApiResponse<Analysis>>("/analyze", {
      resumeId,
      jobDescription: jobDescription || undefined,
    });
    return data.data;
  },

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<Analysis>>(`/analyze/${id}`);
    return data.data;
  },

  async getAll() {
    const { data } = await api.get<ApiResponse<Analysis[]>>("/analyze");
    return data.data;
  },
};

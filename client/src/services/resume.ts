import api from "./api";
import { ApiResponse, Resume, DashboardStats } from "@/types";

export const resumeService = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append("resume", file);
    const { data } = await api.post<ApiResponse<Resume>>("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  },

  async getAll() {
    const { data } = await api.get<ApiResponse<Resume[]>>("/resume");
    return data.data;
  },

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<Resume>>(`/resume/${id}`);
    return data.data;
  },

  async delete(id: string) {
    const { data } = await api.delete<ApiResponse<{ message: string }>>(`/resume/${id}`);
    return data.data;
  },

  async getDashboardStats() {
    const { data } = await api.get<ApiResponse<DashboardStats>>("/resume/dashboard");
    return data.data;
  },
};

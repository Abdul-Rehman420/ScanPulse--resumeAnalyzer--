import api from "./api";
import { ApiResponse, AuthResponse, User } from "@/types";

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/register", {
      name,
      email,
      password,
    });
    return data.data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    });
    return data.data;
  },

  async getProfile() {
    const { data } = await api.get<ApiResponse<User>>("/auth/profile");
    return data.data;
  },
};

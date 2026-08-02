import api from "./api";
import { AdminDashboardData, User } from "@/types";

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  return api.get("/admin/dashboard");
}

export async function getAdminUsers(
  page = 1,
  limit = 20
): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
  return api.get(`/admin/users?page=${page}&limit=${limit}`);
}

export async function updateUserRole(id: string, role: string): Promise<void> {
  await api.patch(`/admin/users/${id}`, { role });
}

export async function deleteUser(id: string): Promise<void> {
  await api.del(`/admin/users/${id}`);
}

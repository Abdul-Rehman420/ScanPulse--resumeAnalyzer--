import api from "./api";
import { AdminDashboardData, User } from "@/types";

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const res = await api.get("/admin/dashboard");
  return res.data.data;
}

export async function getAdminUsers(
  page = 1,
  limit = 20
): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
  const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
  return res.data.data;
}

export async function updateUserRole(id: string, role: string): Promise<void> {
  await api.patch(`/admin/users/${id}/role`, { role });
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

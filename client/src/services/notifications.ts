import api from "./api";
import { Notification } from "@/types";

export async function getNotifications(): Promise<Notification[]> {
  return api.get("/notifications");
}

export async function getUnreadCount(): Promise<number> {
  const data = await api.get<{ count: number }>("/notifications/unread-count");
  return data.count;
}

export async function markAsRead(id: string): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch("/notifications");
}

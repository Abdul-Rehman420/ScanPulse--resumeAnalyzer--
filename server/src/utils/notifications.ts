import { prisma } from "../config/database";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  return prisma.notification.create({ data });
}

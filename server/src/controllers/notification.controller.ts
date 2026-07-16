import { Request, Response } from "express";
import { catchAsync } from "../utils/helpers";
import { prisma } from "../config/database";

export const listNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ success: true, data: notifications });
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const id = req.params.id as string;

  await prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });

  res.json({ success: true, message: "Marked as read" });
});

export const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });

  res.json({ success: true, message: "All marked as read" });
});

export const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const count = await prisma.notification.count({
    where: { userId, read: false },
  });
  res.json({ success: true, data: { count } });
});

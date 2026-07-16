import { Request, Response } from "express";
import { catchAsync } from "../utils/helpers";
import { prisma } from "../config/database";

export const getDashboard = catchAsync(async (_req: Request, res: Response) => {
  const [totalUsers, totalResumes, totalAnalyses, totalCoverLetters] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.analysis.count(),
    prisma.coverLetter.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const avgScore = await prisma.analysis.aggregate({ _avg: { atsScore: true } });

  res.json({
    success: true,
    data: {
      stats: { totalUsers, totalResumes, totalAnalyses, totalCoverLetters, avgAtsScore: Math.round(avgScore._avg.atsScore || 0) },
      recentUsers,
    },
  });
});

export const listUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    }),
    prisma.user.count(),
  ]);

  res.json({ success: true, data: { users, total, page, totalPages: Math.ceil(total / limit) } });
});

export const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { role } = req.body;

  if (!["USER", "ADMIN"].includes(role)) {
    res.status(400).json({ success: false, message: "Invalid role" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  await prisma.user.update({ where: { id }, data: { role } });
  res.json({ success: true, message: `User role updated to ${role}` });
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }

  await prisma.user.delete({ where: { id } });
  res.json({ success: true, message: "User deleted" });
});

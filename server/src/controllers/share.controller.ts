import { Request, Response } from "express";
import { catchAsync } from "../utils/helpers";
import { prisma } from "../config/database";
import crypto from "crypto";

export const createShareLink = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { analysisId, expiresInDays } = req.body;

  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, userId },
  });

  if (!analysis) {
    res.status(404).json({ success: false, message: "Analysis not found" });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const shared = await prisma.sharedAnalysis.create({
    data: { analysisId, userId, token, expiresAt },
  });

  res.status(201).json({
    success: true,
    data: {
      id: shared.id,
      token: shared.token,
      url: `${req.protocol}://${req.get("host")}/api/share/${shared.token}`,
      expiresAt: shared.expiresAt,
    },
  });
});

export const getSharedAnalysis = catchAsync(async (req: Request, res: Response) => {
  const token = req.params.token as string;

  const shared = await prisma.sharedAnalysis.findUnique({
    where: { token },
    include: {
      analysis: {
        include: {
          resume: { select: { originalName: true, uploadedAt: true } },
        },
      },
    },
  });

  if (!shared) {
    res.status(404).json({ success: false, message: "Shared analysis not found" });
    return;
  }

  if (shared.expiresAt && shared.expiresAt < new Date()) {
    res.status(410).json({ success: false, message: "Share link has expired" });
    return;
  }

  await prisma.sharedAnalysis.update({
    where: { id: shared.id },
    data: { views: shared.views + 1 },
  });

  res.json({ success: true, data: shared });
});

export const listSharedAnalyses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const shared = await prisma.sharedAnalysis.findMany({
    where: { userId },
    include: {
      analysis: {
        select: {
          id: true,
          atsScore: true,
          overallRating: true,
          summary: true,
          resume: { select: { originalName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: shared });
});

export const deleteShareLink = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const id = req.params.id as string;

  const shared = await prisma.sharedAnalysis.findFirst({ where: { id, userId } });
  if (!shared) {
    res.status(404).json({ success: false, message: "Share link not found" });
    return;
  }

  await prisma.sharedAnalysis.delete({ where: { id } });
  res.json({ success: true, message: "Share link deleted" });
});

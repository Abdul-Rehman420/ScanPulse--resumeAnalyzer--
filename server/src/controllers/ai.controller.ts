import { Request, Response } from "express";
import { catchAsync } from "../utils/helpers";
import { rewriteResumeSection, generateCoverLetter } from "../services/ai.service";
import { prisma } from "../config/database";

export const rewriteSection = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { section, instructions, resumeId } = req.body;

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume || !resume.extractedText) {
    res.status(404).json({ success: false, message: "Resume not found or has no extracted text" });
    return;
  }

  const rewritten = await rewriteResumeSection(resume.extractedText, section, instructions);
  res.json({ success: true, data: { rewritten, section } });
});

export const createCoverLetter = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { resumeId, jobTitle, companyName, jobDescription } = req.body;

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume || !resume.extractedText) {
    res.status(404).json({ success: false, message: "Resume not found" });
    return;
  }

  const content = await generateCoverLetter(resume.extractedText, jobTitle, companyName, jobDescription);

  const coverLetter = await prisma.coverLetter.create({
    data: {
      userId,
      resumeId,
      jobDescription: jobDescription || null,
      companyName,
      jobTitle,
      content,
    },
  });

  res.status(201).json({ success: true, data: coverLetter });
});

export const listCoverLetters = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const coverLetters = await prisma.coverLetter.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: coverLetters });
});

export const deleteCoverLetter = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const id = req.params.id as string;

  const cl = await prisma.coverLetter.findFirst({ where: { id, userId } });
  if (!cl) {
    res.status(404).json({ success: false, message: "Cover letter not found" });
    return;
  }

  await prisma.coverLetter.delete({ where: { id } });
  res.json({ success: true, message: "Cover letter deleted" });
});

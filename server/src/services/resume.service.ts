import { prisma } from "../config/database";
import { NotFoundError } from "../utils/errors";
import { parseResume } from "./pdf-parser.service";

function deserialize<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function transformResume(resume: any) {
  if (!resume) return resume;
  return {
    ...resume,
    parsedData: resume.parsedData ? deserialize(resume.parsedData, null) : null,
    analysis: resume.analysis
      ? {
          ...resume.analysis,
          strengths: deserialize(resume.analysis.strengths, []),
          weaknesses: deserialize(resume.analysis.weaknesses, []),
          missingKeywords: deserialize(resume.analysis.missingKeywords, []),
          grammarSuggestions: deserialize(resume.analysis.grammarSuggestions, []),
          recommendations: deserialize(resume.analysis.recommendations, []),
          atsTips: deserialize(resume.analysis.atsTips, []),
          matchedKeywords: deserialize(resume.analysis.matchedKeywords, []),
          jobMatchData: resume.analysis.jobMatchData
            ? deserialize(resume.analysis.jobMatchData, null)
            : null,
        }
      : undefined,
  };
}

export async function uploadResume(
  userId: string,
  file: Express.Multer.File
) {
  const { text, parsed } = await parseResume(file.path);

  const resume = await prisma.resume.create({
    data: {
      userId,
      fileName: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      extractedText: text,
      parsedData: JSON.stringify(parsed),
    },
  });

  return transformResume(resume);
}

export async function getUserResumes(userId: string) {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
    include: {
      analysis: {
        select: {
          id: true,
          atsScore: true,
          overallRating: true,
          createdAt: true,
        },
      },
    },
  });

  return resumes.map(transformResume);
}

export async function getResumeById(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: { analysis: true },
  });

  if (!resume) {
    throw new NotFoundError("Resume");
  }

  return transformResume(resume);
}

export async function deleteResume(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume) {
    throw new NotFoundError("Resume");
  }

  await prisma.resume.delete({ where: { id: resumeId } });

  return { message: "Resume deleted successfully" };
}

export async function getDashboardStats(userId: string) {
  const [totalResumes, analyses] = await Promise.all([
    prisma.resume.count({ where: { userId } }),
    prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { atsScore: true, createdAt: true },
    }),
  ]);

  const totalAnalyses = analyses.length;
  const avgScore =
    totalAnalyses > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalAnalyses
        )
      : 0;
  const highestScore =
    totalAnalyses > 0
      ? Math.max(...analyses.map((a) => a.atsScore))
      : 0;

  return {
    totalResumes,
    totalAnalyses,
    avgScore,
    highestScore,
    scoreHistory: analyses.slice(-6),
  };
}

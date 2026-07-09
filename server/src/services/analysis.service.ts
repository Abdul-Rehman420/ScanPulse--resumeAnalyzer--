import { prisma } from "../config/database";
import { NotFoundError, AppError } from "../utils/errors";
import { analyzeResume } from "./ai.service";

function serialize(obj: any): string {
  return JSON.stringify(obj);
}

function deserialize<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function transformAnalysis(analysis: any) {
  if (!analysis) return analysis;
  return {
    ...analysis,
    strengths: deserialize(analysis.strengths, []),
    weaknesses: deserialize(analysis.weaknesses, []),
    missingKeywords: deserialize(analysis.missingKeywords, []),
    grammarSuggestions: deserialize(analysis.grammarSuggestions, []),
    recommendations: deserialize(analysis.recommendations, []),
    atsTips: deserialize(analysis.atsTips, []),
    matchedKeywords: deserialize(analysis.matchedKeywords, []),
    jobMatchData: analysis.jobMatchData ? deserialize(analysis.jobMatchData, null) : null,
  };
}

function transformResume(resume: any) {
  if (!resume) return resume;
  return {
    ...resume,
    parsedData: resume.parsedData ? deserialize(resume.parsedData, null) : null,
    analysis: resume.analysis ? transformAnalysis(resume.analysis) : undefined,
  };
}

export async function createAnalysis(
  userId: string,
  resumeId: string,
  jobDescription?: string
) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume) {
    throw new NotFoundError("Resume");
  }

  if (!resume.extractedText) {
    throw new AppError("Resume text could not be extracted", 400);
  }

  const existingAnalysis = await prisma.analysis.findUnique({
    where: { resumeId },
  });

  if (existingAnalysis) {
    await prisma.analysis.delete({ where: { id: existingAnalysis.id } });
  }

  const { analysis, jobMatch } = await analyzeResume(
    resume.extractedText,
    jobDescription
  );

  const saved = await prisma.analysis.create({
    data: {
      resumeId,
      userId,
      atsScore: analysis.atsScore,
      grammarScore: analysis.grammarScore,
      keywordScore: analysis.keywordScore,
      overallRating: analysis.overallRating,
      summary: analysis.summary,
      strengths: serialize(analysis.strengths),
      weaknesses: serialize(analysis.weaknesses),
      missingKeywords: serialize(analysis.missingKeywords),
      grammarSuggestions: serialize(analysis.grammarSuggestions),
      recommendations: serialize(analysis.recommendations),
      atsTips: serialize(analysis.atsTips),
      matchedKeywords: serialize(analysis.matchedKeywords),
      jobMatchData: jobMatch ? serialize(jobMatch) : undefined,
    },
    include: {
      resume: {
        select: { originalName: true, uploadedAt: true },
      },
    },
  });

  return transformAnalysis(saved);
}

export async function getAnalysisById(analysisId: string, userId: string) {
  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, userId },
    include: {
      resume: {
        select: { originalName: true, uploadedAt: true, parsedData: true },
      },
    },
  });

  if (!analysis) {
    throw new NotFoundError("Analysis");
  }

  return transformAnalysis(analysis);
}

export async function getUserAnalyses(userId: string) {
  const analyses = await prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      resume: {
        select: { originalName: true },
      },
    },
  });

  return analyses.map(transformAnalysis);
}

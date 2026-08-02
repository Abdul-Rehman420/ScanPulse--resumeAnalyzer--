import { handle, readJson } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { analyzeResume } from "@/lib/server/ai";
import { createNotification } from "@/lib/server/notifications";
import { enforceAiRateLimit } from "@/lib/server/rate-limit";
import { deserialize, serialize } from "@/lib/server/serializers";
import { analyzeSchema, parseBody } from "@/lib/server/validators";
import { AppError, NotFoundError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

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
    jobMatchData: analysis.jobMatchData
      ? deserialize(analysis.jobMatchData, null)
      : null,
  };
}

export const POST = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const body = parseBody(await readJson(req), analyzeSchema);

  await enforceAiRateLimit(userId);

  const resume = await prisma.resume.findFirst({
    where: { id: body.resumeId, userId },
  });

  if (!resume) throw new NotFoundError("Resume");
  if (!resume.extractedText) {
    throw new AppError("Resume text could not be extracted", 400);
  }

  const existingAnalysis = await prisma.analysis.findUnique({
    where: { resumeId: resume.id },
  });
  if (existingAnalysis) {
    await prisma.analysis.delete({ where: { id: existingAnalysis.id } });
  }

  const { analysis, jobMatch } = await analyzeResume(
    resume.extractedText,
    body.jobDescription
  );

  const saved = await prisma.analysis.create({
    data: {
      resumeId: resume.id,
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
      resume: { select: { originalName: true, uploadedAt: true } },
    },
  });

  await createNotification({
    userId,
    type: "analysis_complete",
    title: "Analysis Complete",
    message: `Your resume "${resume.originalName}" scored ${analysis.atsScore}/100`,
    link: `/analysis/${saved.id}`,
  });

  return transformAnalysis(saved);
});

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const analyses = await prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { resume: { select: { originalName: true } } },
  });
  return analyses.map(transformAnalysis);
});

import { handle, getParam } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { deserialize } from "@/lib/server/serializers";
import { NotFoundError } from "@/lib/server/errors";

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

export const GET = handle(async (req, ctx) => {
  const { userId } = await verifyAuth(req);
  const id = await getParam(ctx, "id");

  const analysis = await prisma.analysis.findFirst({
    where: { id, userId },
    include: {
      resume: { select: { originalName: true, uploadedAt: true, parsedData: true } },
    },
  });

  if (!analysis) throw new NotFoundError("Analysis");

  return transformAnalysis(analysis);
});

import { handle } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);

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
      ? Math.round(analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalAnalyses)
      : 0;
  const highestScore =
    totalAnalyses > 0 ? Math.max(...analyses.map((a) => a.atsScore)) : 0;

  return {
    totalResumes,
    totalAnalyses,
    avgScore,
    highestScore,
    scoreHistory: analyses.slice(-6),
  };
});

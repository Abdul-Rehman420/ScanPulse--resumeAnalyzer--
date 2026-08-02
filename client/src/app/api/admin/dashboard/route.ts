import { handle } from "@/lib/server/route";
import { requireAdmin } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export const GET = handle(async (req) => {
  await requireAdmin(req);

  const [totalUsers, totalResumes, totalAnalyses, totalCoverLetters] =
    await Promise.all([
      prisma.profile.count(),
      prisma.resume.count(),
      prisma.analysis.count(),
      prisma.coverLetter.count(),
    ]);

  const recentUsers = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const avgScore = await prisma.analysis.aggregate({ _avg: { atsScore: true } });

  return {
    stats: {
      totalUsers,
      totalResumes,
      totalAnalyses,
      totalCoverLetters,
      avgAtsScore: Math.round(avgScore._avg.atsScore || 0),
    },
    recentUsers,
  };
});

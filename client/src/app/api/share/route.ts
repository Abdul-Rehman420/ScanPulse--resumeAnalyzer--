import { handle, readJson } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { env } from "@/lib/server/env";
import { shareSchema, parseBody } from "@/lib/server/validators";
import { NotFoundError } from "@/lib/server/errors";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const body = parseBody(await readJson(req), shareSchema);

  const analysis = await prisma.analysis.findFirst({
    where: { id: body.analysisId, userId },
  });
  if (!analysis) throw new NotFoundError("Analysis");

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = body.expiresInDays
    ? new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const shared = await prisma.sharedAnalysis.create({
    data: { analysisId: analysis.id, userId, token, expiresAt },
  });

  return {
    id: shared.id,
    token: shared.token,
    url: `${env.APP_URL}/api/share/${shared.token}`,
    expiresAt: shared.expiresAt,
  };
});

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);
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
  return shared;
});

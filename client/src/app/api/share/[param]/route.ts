import { handle, getParam } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { AppError, NotFoundError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

export const GET = handle(async (_req, ctx) => {
  const token = await getParam(ctx, "param");

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

  if (!shared) throw new NotFoundError("Shared analysis");

  if (shared.expiresAt && shared.expiresAt < new Date()) {
    throw new AppError("Share link has expired", 410);
  }

  await prisma.sharedAnalysis.update({
    where: { id: shared.id },
    data: { views: shared.views + 1 },
  });

  return shared;
});

export const DELETE = handle(async (req, ctx) => {
  const { userId } = await verifyAuth(req);
  const id = await getParam(ctx, "param");

  const shared = await prisma.sharedAnalysis.findFirst({ where: { id, userId } });
  if (!shared) throw new NotFoundError("Share link");

  await prisma.sharedAnalysis.delete({ where: { id } });
  return { message: "Share link deleted" };
});

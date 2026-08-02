import { handle, getParam } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { deserialize } from "@/lib/server/serializers";
import { NotFoundError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

export const GET = handle(async (req, ctx) => {
  const { userId } = await verifyAuth(req);
  const id = await getParam(ctx, "id");

  const resume = await prisma.resume.findFirst({
    where: { id, userId },
    include: { analysis: true },
  });

  if (!resume) throw new NotFoundError("Resume");

  return {
    ...resume,
    parsedData: resume.parsedData ? deserialize(resume.parsedData, null) : null,
  };
});

export const DELETE = handle(async (req, ctx) => {
  const { userId } = await verifyAuth(req);
  const id = await getParam(ctx, "id");

  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) throw new NotFoundError("Resume");

  await prisma.resume.delete({ where: { id } });
  return { message: "Resume deleted successfully" };
});

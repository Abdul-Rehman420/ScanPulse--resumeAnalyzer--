import { handle, getParam } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { NotFoundError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

export const DELETE = handle(async (req, ctx) => {
  const { userId } = await verifyAuth(req);
  const id = await getParam(ctx, "id");

  const cl = await prisma.coverLetter.findFirst({ where: { id, userId } });
  if (!cl) throw new NotFoundError("Cover letter");

  await prisma.coverLetter.delete({ where: { id } });
  return { message: "Cover letter deleted" };
});

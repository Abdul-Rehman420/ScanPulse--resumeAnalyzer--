import { handle, getParam } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export const PATCH = handle(async (req, ctx) => {
  const { userId } = await verifyAuth(req);
  const id = await getParam(ctx, "id");

  await prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });

  return { message: "Marked as read" };
});

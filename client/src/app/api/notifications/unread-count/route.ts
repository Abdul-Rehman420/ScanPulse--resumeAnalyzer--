import { handle } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const count = await prisma.notification.count({ where: { userId, read: false } });
  return { count };
});

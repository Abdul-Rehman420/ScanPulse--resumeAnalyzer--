import { handle } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return notifications;
});

export const PATCH = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
  return { message: "All marked as read" };
});

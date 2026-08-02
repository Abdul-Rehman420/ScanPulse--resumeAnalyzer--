import { handle } from "@/lib/server/route";
import { requireAdmin } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";

export const dynamic = "force-dynamic";

export const GET = handle(async (req) => {
  await requireAdmin(req);

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10) || 20)
  );
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.profile.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.profile.count(),
  ]);

  return { users, total, page, totalPages: Math.ceil(total / limit) };
});

import { handle, readJson } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
});

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const profile = await prisma.profile.findUnique({ where: { id: userId } });
  if (!profile) {
    return { id: userId, name: "", email: "", role: "USER", createdAt: null };
  }
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
});

export const POST = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const body = updateProfileSchema.safeParse(await readJson(req));
  if (!body.success) throw new Error(body.error.issues[0]?.message || "Invalid name");

  const profile = await prisma.profile.upsert({
    where: { id: userId },
    create: { id: userId, email: "", name: body.data.name, role: "USER" },
    update: { name: body.data.name },
  });

  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    createdAt: profile.createdAt,
  };
});

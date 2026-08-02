import { handle, getParam, readJson } from "@/lib/server/route";
import { requireAdmin, getSupabaseAdmin } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { updateRoleSchema, parseBody } from "@/lib/server/validators";
import { AppError, NotFoundError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

export const PATCH = handle(async (req, ctx) => {
  const admin = await requireAdmin(req);
  const id = await getParam(ctx, "id");
  const body = parseBody(await readJson(req), updateRoleSchema);

  if (id === admin.userId && body.role === "USER") {
    throw new AppError("You cannot demote yourself", 400);
  }

  const user = await prisma.profile.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User");

  await prisma.profile.update({ where: { id }, data: { role: body.role } });

  return { message: `User role updated to ${body.role}` };
});

export const DELETE = handle(async (req, ctx) => {
  const admin = await requireAdmin(req);
  const id = await getParam(ctx, "id");

  if (id === admin.userId) {
    throw new AppError("You cannot delete your own account", 400);
  }

  const user = await prisma.profile.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User");

  await prisma.profile.delete({ where: { id } });

  try {
    await getSupabaseAdmin().auth.admin.deleteUser(id);
  } catch {
    // user may not exist in auth yet; profile deletion is authoritative
  }

  return { message: "User deleted" };
});

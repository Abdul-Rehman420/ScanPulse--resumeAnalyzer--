import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";
import { prisma } from "./prisma";
import { ForbiddenError, UnauthorizedError } from "./errors";

let supabaseAdminClient: SupabaseClient | undefined;

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabaseAdminClient;
}

export interface AuthContext {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyAuth(request: Request): Promise<AuthContext> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  const supaUser = data.user;
  if (!supaUser.email) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  let profile = await prisma.profile.findUnique({ where: { id: supaUser.id } });

  if (!profile) {
    const name =
      (supaUser.user_metadata?.name as string) ||
      supaUser.email.split("@")[0] ||
      "User";
    profile = await prisma.profile.create({
      data: { id: supaUser.id, email: supaUser.email, name, role: "USER" },
    });
  }

  return {
    userId: supaUser.id,
    email: supaUser.email,
    name: profile.name,
    role: profile.role,
  };
}

export async function requireAdmin(request: Request): Promise<AuthContext> {
  const auth = await verifyAuth(request);
  if (auth.role !== "ADMIN") {
    throw new ForbiddenError("Admin access required");
  }
  return auth;
}

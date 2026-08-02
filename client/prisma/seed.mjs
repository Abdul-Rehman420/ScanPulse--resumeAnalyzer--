import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(dir, "..", ".env"));

const prisma = new PrismaClient();

const DEMO_EMAIL = process.env.SEED_DEMO_EMAIL || "demo@example.com";
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "demo123456";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123456";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in client/.env");
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function ensureAuthUser(email, password, name) {
  const { data: listed, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) {
    throw new Error(`Lookup ${email} failed: ${listError.message}`);
  }
  const existing = listed.users.find((u) => u.email === email);
  if (existing) {
    return existing;
  }
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error) {
    throw new Error(`createUser ${email} failed: ${error.message}`);
  }
  return data.user;
}

async function upsertProfile(authUser, name, role) {
  await prisma.profile.upsert({
    where: { id: authUser.id },
    update: { email: authUser.email, name, role },
    create: { id: authUser.id, email: authUser.email, name, role },
  });
}

async function main() {
  const demoUser = await ensureAuthUser(DEMO_EMAIL, DEMO_PASSWORD, "Demo User");
  const adminUser = await ensureAuthUser(ADMIN_EMAIL, ADMIN_PASSWORD, "Admin User");

  await upsertProfile(demoUser, "Demo User", "USER");
  await upsertProfile(adminUser, "Admin User", "ADMIN");

  console.log("Seeded users:");
  console.log(`  demo:  ${DEMO_EMAIL} / ${DEMO_PASSWORD} (USER)`);
  console.log(`  admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD} (ADMIN)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

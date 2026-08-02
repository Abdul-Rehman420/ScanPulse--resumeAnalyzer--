import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});

export async function uploadResumeFile(
  userId: string,
  file: File
): Promise<string> {
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;

  const { error } = await getSupabase()
    .storage.from("resumes")
    .upload(path, file, {
      contentType: "application/pdf",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message || "Failed to upload resume file");
  }

  return path;
}

export async function deleteResumeFile(path: string): Promise<void> {
  if (!path) return;
  const { error } = await getSupabase().storage.from("resumes").remove([path]);
  if (error) {
    console.error("Failed to delete resume file from storage", error);
  }
}

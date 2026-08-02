import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.startsWith("YOUR_") || value === "placeholder") {
    throw new Error(`${name} must be set in client/.env`);
  }
  return value;
}

export const env: {
  NODE_ENV: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DATABASE_URL: string;
  GROQ_API_KEY: string;
  GROQ_MODEL: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  APP_URL: string;
} = {
  get NODE_ENV() {
    return process.env.NODE_ENV || "development";
  },
  get NEXT_PUBLIC_SUPABASE_URL() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get DATABASE_URL() {
    return required("DATABASE_URL");
  },
  get GROQ_API_KEY() {
    return required("GROQ_API_KEY");
  },
  get GROQ_MODEL() {
    return process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  },
  get RESEND_API_KEY() {
    return required("RESEND_API_KEY");
  },
  get RESEND_FROM_EMAIL() {
    return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  },
  get APP_URL() {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  },
};

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "fallback-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
};

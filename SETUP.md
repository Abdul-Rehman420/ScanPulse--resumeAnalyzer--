# Setup Guide

## Prerequisites

```bash
node --version  # >= 20 (Node 22 recommended)
npm --version   # >= 9
```

## 1. Supabase Project

1. Create a free project at [dashboard.supabase.com](https://supabase.com)
2. **Auth → Providers** → enable **Email** (password sign-in)
3. **Auth → Settings** → turn **OFF** "Confirm email" (register goes straight to the dashboard)
4. **Storage → New bucket** → name it `resumes`
   - For private uploads: leave it **private** and let the service role upload
5. Project settings → **API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
6. Connect → **Direct connection** string → `DATABASE_URL` (this is what Prisma uses)

## 2. Install

```bash
cd client
npm install
```

## 3. Environment File

Create `client/.env` (gitignored). All secrets stay server-side (never `NEXT_PUBLIC_`):

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_APP_NAME="AI Resume Analyzer"
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@aws-0-YOUR-REGION.pooler.supabase.com:5432/postgres

GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile

RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=onboarding@resend.dev
```

## 4. Database + Seed

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to Supabase Postgres
npm run db:seed       # Create demo + admin users (creates them in Supabase Auth too)
```

Seeded accounts:

| Role  | Email                | Password     |
|-------|----------------------|--------------|
| User  | `demo@example.com`   | `demo123456` |
| Admin | `admin@example.com`  | `admin123456` |

> The seed uses the service role key to create the auth users, then upserts matching `profiles` rows. Re-run any time to repair missing profiles.

## 5. Run

```bash
npm run dev   # http://localhost:3000
```

## Available Scripts (client/)

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Lint check |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema to the database |
| `npm run db:seed` | Seed demo + admin users |
| `npm run db:studio` | Open Prisma Studio |

## Troubleshooting

### Prisma Client not generated
```bash
npm run db:generate
```

### Database connection issues
- Use the Supabase **Direct connection** string (not the pooled one) for `DATABASE_URL`
- Your IP may need to be allowed if IPv6/DB-level restrictions are enabled (temporarily disable for dev)

### `NEXT_PUBLIC_SUPABASE_URL must be set`
The env getters throw lazily on first use. Fill in all values in `client/.env` — placeholders starting with `YOUR_` are rejected.

### PDF won't upload / "Invalid PDF file"
The app checks for the `%PDF-` magic bytes, then extracts text in the browser with pdfjs-dist. Scanned/image-only PDFs may yield no text.

### AI API errors
Verify your Groq API key at https://console.groq.com/keys. Rate limit is 5 AI requests per minute per user.

### Email not sending
Use a verified sender in Resend. The free `onboarding@resend.dev` only sends to your account email; verify a domain to send to anyone.

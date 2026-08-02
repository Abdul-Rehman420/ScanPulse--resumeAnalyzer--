# Deployment Guide

The application is a **single deployable unit** — the Next.js app in `client/`. Route handlers replace the old Express backend, and Supabase hosts Auth, Postgres, and Storage. Deploy everything to Vercel.

## Deploy to Vercel

### Steps
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set the **Root Directory** to `client`
4. Set the **Framework Preset** to `Next.js`
5. Add environment variables (from `client/.env`):

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `/api` (route handlers live in the same app) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `AI Resume Analyzer` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (**secret** — never expose in client) |
| `DATABASE_URL` | Supabase Postgres **direct** connection string |
| `GROQ_API_KEY` | Groq API key |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain) |

6. Deploy

### Production database setup
Run against your production Supabase project:

```bash
cd client
npm run db:generate
npm run db:push
npm run db:seed   # optional - creates demo + admin accounts
```

> The 7-day inactivity pause on free Supabase projects pauses your DB too. Upgrade or keep activity to avoid downtime.

## Production Checklist

- [ ] Supabase Auth: email provider enabled, "Confirm email" **off**
- [ ] `resumes` storage bucket created
- [ ] Secrets only in Vercel env vars (never `NEXT_PUBLIC_` for `SUPABASE_SERVICE_ROLE_KEY`/`DATABASE_URL`)
- [ ] Database RLS deny-by-default; all DB writes go through route handlers using the service role
- [ ] Two Supabase projects: one for dev, one for prod (recommended)
- [ ] Custom domain (optional)
- [ ] Monitoring / error tracking (optional)

## AI Rate Limiting

Global AI calls (analyze, rewrite, cover letters) are limited to **5 requests per minute per user** via the `ai_usage` table (`AiUsage` UPSERT). This is enforced in the route handlers and is serverless-safe.

## Email

Resend's free `onboarding@resend.dev` sender only delivers to your own account email. To send reports to any recipient, add and verify a domain in Resend and set `RESEND_FROM_EMAIL` to an address on that domain.

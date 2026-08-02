# AI Resume Analyzer

An AI-powered resume analysis tool that provides ATS scores, keyword analysis, grammar suggestions, and job description matching. Built with Next.js 15 (App Router), Supabase (Auth + Postgres + Storage), Prisma, and Groq AI. Deploys as a single unit on Vercel.

## Features

- **ATS Score Analysis** - Get detailed ATS compatibility scores out of 100
- **Keyword Optimization** - Identify matched and missing keywords for your target role
- **Grammar Check** - AI-powered grammar and spelling correction
- **Job Description Matching** - Paste a JD to get match %, missing skills, and tailored suggestions
- **AI Recommendations** - Personalized suggestions to improve your resume
- **AI Rewrite & Cover Letters** - Rewrite resume sections or generate tailored cover letters
- **Dashboard** - Track your resume improvement history with charts
- **Admin Panel** - User management (roles, deletion) for admins
- **Dark/Light Mode** - Theme support with persistent preferences

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn/UI |
| Backend | Next.js Route Handlers (`/api/*`) - no separate server |
| Auth | Supabase Auth (email/password) |
| Database | Supabase Postgres via Prisma ORM |
| File Storage | Supabase Storage (`resumes` bucket) |
| PDF Parsing | pdfjs-dist (client-side, in-browser) |
| AI | Groq AI (Llama 3.3 70B) |
| Email | Resend |
| Charts | Recharts |
| Animations | Framer Motion |

## Project Structure

```
resume-analyzer/
├── client/              # The entire application (Next.js)
│   ├── prisma/
│   │   ├── schema.prisma  # Postgres schema (profiles, resumes, analyses...)
│   │   └── seed.mjs       # Seeds demo + admin Supabase auth users & profiles
│   ├── src/
│   │   ├── app/           # Pages + API route handlers
│   │   │   ├── api/       # /api/* route handlers (auth, resume, analyze, ai, share...)
│   │   │   ├── (auth)/    # login, register
│   │   │   └── (dashboard)/ # dashboard, upload, history, ai-rewrite, cover-letters, settings, admin
│   │   ├── components/    # UI, landing, dashboard, analysis, shared
│   │   ├── hooks/         # use-auth (Supabase session provider)
│   │   ├── lib/server/    # env, prisma, supabase, ai, email, pdf, rate-limit, validators...
│   │   ├── lib/           # Browser Supabase client + Storage helpers
│   │   ├── services/      # Typed API client for route handlers
│   │   ├── types/         # TypeScript interfaces
│   │   ├── utils/         # Utilities (pdfjs text extraction)
│   │   └── providers/     # Context providers
│   └── .env               # Environment variables (gitignored)
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ (Node 22 recommended)
- A [Supabase](https://supabase.com) project (free tier)
- Groq API key ([get one free](https://console.groq.com/keys))
- Resend API key ([get one free](https://resend.com))

### Installation

```bash
# 1. Install dependencies
cd client
npm install

# 2. Set up environment variables
# Edit client/.env (see template below)
```

`client/.env`:
```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_APP_NAME="AI Resume Analyzer"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Supabase "Connect" > "Direct connection" string
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@aws-0-YOUR-REGION.pooler.supabase.com:5432/postgres

# Groq AI
GROQ_API_KEY=YOUR_GROQ_KEY
GROQ_MODEL=llama-3.3-70b-versatile

# Resend Email
RESEND_API_KEY=YOUR_RESEND_KEY
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Supabase Project Setup

1. Create a project at [dashboard.supabase.com](https://supabase.com)
2. **Auth** → **Providers** → enable Email (password)
3. **Auth** → **Settings** → turn **OFF** "Confirm email" (register goes straight to dashboard)
4. **Storage** → create a **public bucket** named `resumes` (or private + service-role uploads)
5. Copy the Project URL, anon key, and service role key into `client/.env`

### Database

```bash
cd client
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to Supabase Postgres
npm run db:seed       # Create demo + admin users
```

### Run

```bash
cd client
npm run dev           # http://localhost:3000
```

### Demo Credentials (after seeding)

| Role  | Email                | Password     |
|-------|----------------------|--------------|
| User  | `demo@example.com`   | `demo123456` |
| Admin | `admin@example.com`  | `admin123456` |

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

## API Endpoints

All routes are Next.js route handlers under `client/src/app/api`. Protected routes require `Authorization: Bearer <supabase-access-token>`.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/profile` | Get current user profile (auto-creates profile) |
| POST | `/api/auth/profile` | Update profile |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume` | Create resume (after client-side PDF parse + storage upload) |
| GET | `/api/resume` | List user's resumes |
| GET | `/api/resume/dashboard` | Dashboard stats |
| GET | `/api/resume/:id` | Get resume by ID |
| DELETE | `/api/resume/:id` | Delete resume |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze resume (optional JD) - rate limited (5/min/user) |
| GET | `/api/analyze` | List all analyses |
| GET | `/api/analyze/:id` | Get analysis by ID |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/rewrite` | Rewrite a resume section |
| POST | `/api/ai/cover-letter` | Generate a cover letter |
| GET | `/api/ai/cover-letter` | List cover letters |
| DELETE | `/api/ai/cover-letter/:id` | Delete a cover letter |

### Share
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/share` | Create a share link (returns raw JSON URL) |
| GET | `/api/share` | List user's share links |
| GET | `/api/share/:token` | **Public** - view shared analysis (increments views) |
| DELETE | `/api/share/:id` | Delete a share link |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications` | Mark all as read |
| GET | `/api/notifications/unread-count` | Unread count |
| PATCH | `/api/notifications/:id/read` | Mark one as read |

### Email
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/email/send-report` | Email an analysis report |

### Admin (ADMIN role only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Aggregate stats + recent users |
| GET | `/api/admin/users` | Paginated user list |
| PATCH | `/api/admin/users/:id` | Change user role |
| DELETE | `/api/admin/users/:id` | Delete user (self-deletion blocked) |

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Vibrant Cyan | `#2AC5CA` | Primary - buttons, links, active states |
| Warm Terracotta | `#CA492A` | Secondary - hover states, warnings |
| Deep Slate Navy | `#1E293B` | Dark mode background |
| Soft Off-White | `#F8FAFC` | Light mode background |

## Deployment

Single deployable unit on Vercel. See [DEPLOYMENT.md](DEPLOYMENT.md).

## License

MIT

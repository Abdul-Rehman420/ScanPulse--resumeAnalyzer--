# AI Resume Analyzer

An AI-powered resume analysis tool that provides ATS scores, keyword analysis, grammar suggestions, and job description matching. Built with Next.js 15, Express, Prisma, MongoDB, and Groq AI.

## Features

- **ATS Score Analysis** - Get detailed ATS compatibility scores out of 100
- **Keyword Optimization** - Identify matched and missing keywords for your target role
- **Grammar Check** - AI-powered grammar and spelling correction
- **Job Description Matching** - Paste a JD to get match %, missing skills, and tailored suggestions
- **AI Recommendations** - Personalized suggestions to improve your resume
- **Dashboard** - Track your resume improvement history with charts
- **Dark/Light Mode** - Theme support with persistent preferences

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Shadcn/UI |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | MongoDB Atlas |
| AI | Groq AI (Llama 3.3 70B) |
| Auth | JWT + bcrypt |
| Charts | Recharts |
| Animations | Framer Motion |

## Project Structure

```
resume-analyzer/
├── client/              # Next.js frontend
│   ├── src/
│   │   ├── app/         # Pages (landing, auth, dashboard, analysis)
│   │   ├── components/  # UI, landing, dashboard, analysis, shared
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API client
│   │   ├── types/       # TypeScript interfaces
│   │   ├── utils/       # Utilities
│   │   └── providers/   # Context providers
│   └── ...
├── server/              # Express backend
│   ├── prisma/          # Schema + migrations
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # Route definitions
│   │   ├── services/    # Business logic (auth, resume, pdf, ai)
│   │   ├── middleware/  # Auth, upload, validation, rate limit
│   │   └── validators/  # Zod schemas
│   └── uploads/         # Local file storage
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Groq API key ([get one free](https://console.groq.com/keys))

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd resume-analyzer

# 2. Install all dependencies
cd server && npm install && cd ../client && npm install && cd ..

# 3. Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your:
# - DATABASE_URL (MongoDB Atlas connection string)
# - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
# - GROQ_API_KEY

# 4. Push schema to MongoDB
cd server
npx prisma db push
npx prisma db seed
cd ..

# 5. Start development
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

### Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Prisma Studio: http://localhost:5555

### Demo Credentials (after seeding)

- Email: `demo@example.com`
- Password: `demo123456`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get current user |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/upload` | Upload PDF resume |
| GET | `/api/resume` | List user's resumes |
| GET | `/api/resume/dashboard` | Dashboard stats |
| GET | `/api/resume/:id` | Get resume by ID |
| DELETE | `/api/resume/:id` | Delete resume |

### Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze resume (optional JD) |
| GET | `/api/analyze` | List all analyses |
| GET | `/api/analyze/:id` | Get analysis by ID |

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `GROQ_API_KEY` | Groq AI API key |
| `CLIENT_URL` | Frontend URL for CORS |
| `PORT` | Server port (default: 5000) |

### Client (`client/.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Vibrant Cyan | `#2AC5CA` | Primary - buttons, links, active states |
| Warm Terracotta | `#CA492A` | Secondary - hover states, warnings |
| Deep Slate Navy | `#1E293B` | Dark mode background |
| Soft Off-White | `#F8FAFC` | Light mode background |

## Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Connect to Vercel, add env vars, deploy
```

### Backend (Render/Railway)
```bash
cd server
# Set build command: npm install && npx prisma generate && npm run build
# Set start command: npm start
# Add environment variables
```

### Database (MongoDB Atlas)
- Create free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist your deployment IP
- Copy `DATABASE_URL` to server env

## License

MIT

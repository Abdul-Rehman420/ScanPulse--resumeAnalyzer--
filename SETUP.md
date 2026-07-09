# Setup Guide

## Quick Start

### 1. Prerequisites

```bash
node --version  # >= 20
npm --version   # >= 9
psql --version  # PostgreSQL client
```

### 2. Database Setup

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE resume_analyzer;"
```

### 3. Server Setup

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Client Setup

```bash
cd client
npm install
```

### 5. Environment Files

**server/.env:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/resume_analyzer"
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.0-flash"
CLIENT_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

**client/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="AI Resume Analyzer"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key to `server/.env` as `GEMINI_API_KEY`

### 7. Run

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

## Available Scripts

### Server

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | TypeScript compilation |
| `npm start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema (dev only) |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

### Client

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Lint check |

## Troubleshooting

### Prisma Client not generated
```bash
cd server
npx prisma generate
```

### Migration issues
```bash
cd server
npx prisma migrate reset  # Resets database
npx prisma db seed        # Re-seed
```

### CORS errors
Ensure `CLIENT_URL` in `server/.env` matches your frontend URL exactly.

### File upload fails
Check `uploads/` directory exists and is writable:
```bash
mkdir -p server/uploads
```

### Gemini API errors
Verify your API key is valid and has quota available at https://aistudio.google.com/apikey

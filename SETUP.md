# Setup Guide

## Quick Start

### 1. Prerequisites

```bash
node --version  # >= 20
npm --version   # >= 9
```

### 2. Database Setup

Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), then get your connection string.

### 3. Server Setup

```bash
cd server
npm install
npx prisma generate
npx prisma db push
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
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/resume_analyzer?retryWrites=true&w=majority"
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRES_IN="7d"
GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="llama-3.3-70b-versatile"
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

### 6. Groq API Key

1. Go to https://console.groq.com/keys
2. Sign in with Google/GitHub
3. Click "Create API Key"
4. Copy the key to `server/.env` as `GROQ_API_KEY`

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
| `npm run db:push` | Push schema to MongoDB |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate Prisma client |

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

### MongoDB connection issues
Ensure your IP is whitelisted in MongoDB Atlas Network Access.

### CORS errors
Ensure `CLIENT_URL` in `server/.env` matches your frontend URL exactly.

### File upload fails
Check `uploads/` directory exists and is writable:
```bash
mkdir -p server/uploads
```

### AI API errors
Verify your Groq API key is valid at https://console.groq.com/keys

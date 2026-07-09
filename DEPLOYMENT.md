# Deployment Guide

## Frontend (Vercel)

### Steps
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set the **Root Directory** to `client`
4. Set the **Framework Preset** to `Next.js`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`
   - `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`
6. Deploy

## Backend (Render)

### Steps
1. Go to [render.com](https://render.com) and create a **New Web Service**
2. Connect your GitHub repository
3. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables (all from `server/.env.example`)
5. Deploy

## Database (Neon)

### Steps
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project (PostgreSQL)
3. Copy the connection string
4. Add it as `DATABASE_URL` in your Render environment variables
5. After first deploy, run migrations via Render Shell:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

## Production Checklist

- [ ] Set strong `JWT_SECRET` (use `openssl rand -hex 64`)
- [ ] Set `NODE_ENV=production`
- [ ] Configure Cloudinary or AWS S3 for file storage
- [ ] Enable PostgreSQL SSL
- [ ] Set up custom domain (optional)
- [ ] Add monitoring (optional)

## File Storage (Production)

### Option 1: Cloudinary
```bash
npm install cloudinary
```

### Option 2: AWS S3
```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

Update `server/src/middleware/upload.middleware.ts` to use cloud storage instead of disk.

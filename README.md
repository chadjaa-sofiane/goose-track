# GooseTrack

## Description
GooseTrack is a calendar-first task management app for planning daily and weekly work with drag-and-drop task boards, timeline navigation, and account-based persistence. This repository is a monorepo that ships the frontend and backend together for local development and single-service deployment.

GooseTrack is a monorepo with:
- `packages/client`: React + Vite frontend
- `packages/api`: Bun + Express + MongoDB backend

## Prerequisites
- Bun `1.2.4+`
- MongoDB (local or hosted)

## Local Setup
1. Install dependencies:
```bash
bun install
```
2. Set backend env vars (example):
```bash
export NODE_ENV=development
export MONGODB_DEVELOPMENT_URI="mongodb://localhost:27017/development"
```
3. Run API:
```bash
bun run --cwd packages/api dev
```
4. Run client (new terminal):
```bash
npm run --workspace packages/client dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:3000`

## Seed Demo User
Creates/updates a shared demo account:
- Email: `demo@orbitflow.app`
- Password: `DemoUser123!`

Run:
```bash
npm run seed:dummy-user
```

## Production (Single Service)
In production, the API serves the built frontend from `packages/client/dist`, so the app runs as one service.

Build client:
```bash
npm run build:client
```

Start server:
```bash
npm run start
```

## Railway Deployment
This repo includes:
- `Dockerfile` (builds client and runs API)
- `railway.json` (tells Railway to use Dockerfile)

Required Railway variables:
- `NODE_ENV=production`
- `MONGODB_PRODUCTION_URI=<your-mongodb-uri>`
- `PORT` (Railway injects this automatically)

Optional:
- `CORS_ORIGIN` (used in non-production; defaults to `http://localhost:5173`)

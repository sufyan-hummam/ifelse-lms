# IF/ELSE Intelligence LMS — Platform Documentation

Applied AI engineering learning management system for **IF/ELSE Intelligence** ("Beyond Binaries"). Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM 7, and Neon Postgres.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+
- Neon PostgreSQL database (connection pooled and direct URLs)

### 2. Environment Variables
Create `.env` using `.env.example`:
```env
DATABASE_URL="postgresql://user:password@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your_secure_random_secret_at_least_32_characters_long"
GEMINI_API_KEY="your_optional_gemini_api_key"
```

### 3. Installation & Database Sync
```bash
npm install
npx prisma generate
npx prisma db push
```

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Role Governance

- **Default Role**: All new sign-ups via `/auth/register` default strictly to `STUDENT`.
- **Role Assignment**: `ADMIN` and `INSTRUCTOR` roles can only be granted by an existing administrator through the Admin Console (`/admin`) or via the one-time admin bootstrap script.
- **No Hardcoded Credentials**: No demo buttons or hardcoded logins exist in production code paths or UI.
- **Rate Limiting**: Integrated sliding-window rate limiting protects `/auth/signin`, `/auth/register`, and `/api/ai/study-buddy`.
- **Session Security**: HTTP-only, SameSite=Lax signed cookies with automatic `secure` flags in production.

---

## 🛠️ Seeding Demo Accounts (Non-Production Only)

To protect production environments, the database seed script is blocked if `NODE_ENV=production` and requires an explicit `SEED_DEMO=true` flag.

### PowerShell (Windows):
```powershell
$env:SEED_DEMO="true"
npm run db:seed
```

### Bash (macOS / Linux):
```bash
SEED_DEMO=true npm run db:seed
```

This creates realistic demo curricula, modules, quizzes, and three demo accounts:
- `student@ifelseintelligence.com` / `Password123!`
- `instructor@ifelseintelligence.com` / `Password123!`
- `admin@ifelseintelligence.com` / `Password123!`

---

## ⚡ One-Time Admin Bootstrap Script

To promote a newly created account to `ADMIN` in a fresh environment without an existing admin:

1. Register an account on the platform via `/auth/register`.
2. Execute the bootstrap script with your email:

### PowerShell:
```powershell
$env:ADMIN_BOOTSTRAP_EMAIL="admin@yourdomain.com"
npm run bootstrap:admin
```

### Bash:
```bash
ADMIN_BOOTSTRAP_EMAIL="admin@yourdomain.com" npm run bootstrap:admin
```

---

## 🌐 Vercel Deployment

Configure the following environment variables in **Vercel Project Settings → Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon Postgres pooled connection URL (`-pooler.ap-southeast-1.aws.neon.tech`) |
| `DIRECT_URL` | Neon Postgres direct connection URL (used for CLI migrations) |
| `BETTER_AUTH_SECRET` | 32+ character random secret for JWT session signing |
| `NEXT_PUBLIC_APP_URL` | Public URL (e.g. `https://learn.ifelseintelligence.com` or Vercel URL) |
| `BETTER_AUTH_URL` | Same as `NEXT_PUBLIC_APP_URL` |
| `GEMINI_API_KEY` | *(Optional)* Google AI Studio API key for live AI Study Buddy |

**Build Command**:
```bash
prisma generate && next build
```

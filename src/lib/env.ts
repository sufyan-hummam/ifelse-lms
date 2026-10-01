import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string({
      error: "CRITICAL CONFIG ERROR: DATABASE_URL is required.",
    })
    .min(1, "CRITICAL CONFIG ERROR: DATABASE_URL cannot be empty. Please provide a valid Neon PostgreSQL connection string."),
  DIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  BETTER_AUTH_SECRET: z
    .string({
      error: "CRITICAL CONFIG ERROR: BETTER_AUTH_SECRET is missing. Please provide a secure random secret of at least 32 characters.",
    })
    .min(32, "CRITICAL CONFIG ERROR: BETTER_AUTH_SECRET must be at least 32 characters long."),
  GEMINI_API_KEY: z.string().optional(),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  ADMIN_BOOTSTRAP_EMAIL: process.env.ADMIN_BOOTSTRAP_EMAIL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => ` - [${i.path.join(".")}]: ${i.message}`).join("\n");
  console.error("❌ Environment validation failure at startup:\n" + issues);
  throw new Error("Failed to start application due to invalid or missing environment variables:\n" + issues);
}

export const env = parsed.data;

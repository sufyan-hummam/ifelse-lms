"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  authenticateWithCredentials,
  clearSessionCookie,
  setSessionCookie,
  type SessionUser,
} from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { Role } from "@generated/prisma/client";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters").max(70, "Full name too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function signInAction(prevState: unknown, formData: FormData) {
  // Rate limit: 5 signin attempts per minute per IP
  const rateCheck = await checkRateLimit({
    keyPrefix: "auth-signin",
    limit: 5,
    windowMs: 60 * 1000,
  });

  if (!rateCheck.success) {
    return {
      error: `Too many sign-in attempts. Please wait ${rateCheck.reset} seconds before trying again.`,
    };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = signInSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  const { user, error } = await authenticateWithCredentials(
    validation.data.email,
    validation.data.password
  );

  if (error || !user) {
    return { error: error || "Invalid email or password" };
  }

  revalidatePath("/", "layout");

  if (user.role === Role.ADMIN) {
    redirect("/admin");
  } else if (user.role === Role.INSTRUCTOR) {
    redirect("/studio");
  } else {
    redirect("/dashboard");
  }
}

export async function registerAction(prevState: unknown, formData: FormData) {
  // Rate limit: 3 account creations per 5 minutes per IP
  const rateCheck = await checkRateLimit({
    keyPrefix: "auth-register",
    limit: 3,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateCheck.success) {
    return {
      error: `Too many registration attempts from your network. Please wait ${rateCheck.reset} seconds.`,
    };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validation = registerSchema.safeParse({ name, email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid input" };
  }

  const normalizedEmail = validation.data.email.toLowerCase().trim();

  const existing = await db.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  // Hash with salt rounds = 12
  const passwordHash = await bcrypt.hash(validation.data.password, 12);
  
  // Explicitly assign STUDENT role only
  const newUser = await db.user.create({
    data: {
      name: validation.data.name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      role: Role.STUDENT,
    },
  });

  const sessionUser: SessionUser = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  };

  await setSessionCookie(sessionUser);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOutAction() {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  redirect("/");
}

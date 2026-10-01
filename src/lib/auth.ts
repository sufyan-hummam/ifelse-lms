import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { Role } from "@generated/prisma/client";

const SESSION_COOKIE_NAME = "ifelse_session";
const SECRET_KEY = new TextEncoder().encode(env.BETTER_AUTH_SECRET);

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  image?: string | null;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string) || null,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireRole(allowedRoles: Role[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function authenticateWithCredentials(
  email: string,
  plainPassword: string
): Promise<{ user: SessionUser | null; error?: string }> {
  const existingUser = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (!existingUser || !existingUser.password) {
    return { user: null, error: "Invalid credentials" };
  }

  const isValid = await bcrypt.compare(plainPassword, existingUser.password);
  if (!isValid) {
    return { user: null, error: "Invalid credentials" };
  }

  const sessionUser: SessionUser = {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    role: existingUser.role,
    image: existingUser.image,
  };

  await setSessionCookie(sessionUser);
  return { user: sessionUser };
}

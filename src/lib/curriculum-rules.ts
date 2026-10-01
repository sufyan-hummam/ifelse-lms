import crypto from "node:crypto";
import { Role } from "@generated/prisma/client";

/**
 * Role-based access control guards
 */
export function hasRequiredRole(userRole: Role | string | undefined | null, allowedRoles: (Role | string)[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function canAccessStudio(role: Role | string | undefined | null): boolean {
  return hasRequiredRole(role, [Role.INSTRUCTOR, Role.ADMIN, "INSTRUCTOR", "ADMIN"]);
}

export function canAccessAdmin(role: Role | string | undefined | null): boolean {
  return hasRequiredRole(role, [Role.ADMIN, "ADMIN"]);
}

export function canAccessDashboard(role: Role | string | undefined | null): boolean {
  return hasRequiredRole(role, [
    Role.STUDENT,
    Role.INSTRUCTOR,
    Role.ADMIN,
    "STUDENT",
    "INSTRUCTOR",
    "ADMIN",
  ]);
}

/**
 * Prerequisite unlock conditional logic
 * IF prerequisite complete THEN unlock ELSE locked
 */
export interface PrerequisiteStatus {
  unlocked: boolean;
  reason: "FOUNDATION" | "PREREQUISITE_SATISFIED" | "PREREQUISITE_LOCKED";
}

export function evaluatePrerequisite(
  prerequisiteCourseId: string | null | undefined,
  completedCourseIds: Iterable<string> | Set<string>
): PrerequisiteStatus {
  // If no prerequisite course is defined, this is a foundational entry point
  if (!prerequisiteCourseId) {
    return { unlocked: true, reason: "FOUNDATION" };
  }

  const completedSet = completedCourseIds instanceof Set
    ? completedCourseIds
    : new Set(completedCourseIds);

  if (completedSet.has(prerequisiteCourseId)) {
    return { unlocked: true, reason: "PREREQUISITE_SATISFIED" };
  }

  return { unlocked: false, reason: "PREREQUISITE_LOCKED" };
}

/**
 * Quiz scoring and threshold evaluation
 */
export interface QuizQuestionItem {
  id: string;
  correctOptionId: string;
}

export interface QuizScoreResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passingScore: number;
}

export function scoreQuizAttempt(
  questions: QuizQuestionItem[],
  submittedAnswers: Record<string, string>,
  passingScore: number
): QuizScoreResult {
  const totalQuestions = questions.length;
  if (totalQuestions === 0) {
    return {
      score: 100,
      passed: true,
      correctCount: 0,
      totalQuestions: 0,
      passingScore,
    };
  }

  let correctCount = 0;
  for (const q of questions) {
    if (submittedAnswers[q.id] === q.correctOptionId) {
      correctCount++;
    }
  }

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercentage >= passingScore;

  return {
    score: scorePercentage,
    passed,
    correctCount,
    totalQuestions,
    passingScore,
  };
}

/**
 * Certificate generation format and validation
 * Format: IFELSE-CERT-<YEAR>-<8 HEX CHARS>
 */
export const CERTIFICATE_REGEX = /^IFELSE-CERT-\d{4}-[0-9A-F]{8}$/;

export function generateCertificateNumber(year?: number): string {
  const y = year ?? new Date().getFullYear();
  const randomSuffix = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `IFELSE-CERT-${y}-${randomSuffix}`;
}

export function isValidCertificateNumber(certificateNumber: string): boolean {
  if (!certificateNumber || typeof certificateNumber !== "string") return false;
  return CERTIFICATE_REGEX.test(certificateNumber);
}

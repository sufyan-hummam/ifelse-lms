import { describe, it, expect } from "vitest";
import {
  hasRequiredRole,
  canAccessStudio,
  canAccessAdmin,
  canAccessDashboard,
  evaluatePrerequisite,
  scoreQuizAttempt,
  generateCertificateNumber,
  isValidCertificateNumber,
  CERTIFICATE_REGEX,
} from "@/lib/curriculum-rules";
import { Role } from "@generated/prisma/client";

describe("IF/ELSE LMS Core Quality Gates", () => {
  /* ==========================================================================
     1. Role Guards & Authorization Permissions
     ========================================================================== */
  describe("Role Guards & Authorization", () => {
    it("should allow STUDENT to access dashboard but block studio and admin", () => {
      const studentRole = Role.STUDENT;

      expect(canAccessDashboard(studentRole)).toBe(true);
      expect(canAccessStudio(studentRole)).toBe(false);
      expect(canAccessAdmin(studentRole)).toBe(false);
    });

    it("should allow INSTRUCTOR to access dashboard and studio, but block admin", () => {
      const instructorRole = Role.INSTRUCTOR;

      expect(canAccessDashboard(instructorRole)).toBe(true);
      expect(canAccessStudio(instructorRole)).toBe(true);
      expect(canAccessAdmin(instructorRole)).toBe(false);
    });

    it("should allow ADMIN full access to dashboard, studio, and admin routes", () => {
      const adminRole = Role.ADMIN;

      expect(canAccessDashboard(adminRole)).toBe(true);
      expect(canAccessStudio(adminRole)).toBe(true);
      expect(canAccessAdmin(adminRole)).toBe(true);
    });

    it("should reject unauthenticated requests or invalid roles", () => {
      expect(canAccessDashboard(null)).toBe(false);
      expect(canAccessStudio(null)).toBe(false);
      expect(canAccessAdmin(null)).toBe(false);

      expect(canAccessDashboard(undefined)).toBe(false);
      expect(canAccessStudio("GUEST")).toBe(false);
      expect(canAccessAdmin("STUDENT")).toBe(false);
    });

    it("should strictly enforce hasRequiredRole checks against allowed lists", () => {
      expect(hasRequiredRole(Role.STUDENT, [Role.STUDENT])).toBe(true);
      expect(hasRequiredRole(Role.STUDENT, [Role.INSTRUCTOR, Role.ADMIN])).toBe(false);
      expect(hasRequiredRole(Role.ADMIN, [Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN])).toBe(true);
    });
  });

  /* ==========================================================================
     2. Prerequisite Unlock Conditional Logic
     "IF prerequisite complete THEN unlock ELSE locked"
     ========================================================================== */
  describe("Prerequisite Unlock Logic", () => {
    it("should automatically unlock foundational entry courses with no prerequisite", () => {
      const completedCourses = new Set<string>();

      const status = evaluatePrerequisite(null, completedCourses);
      expect(status.unlocked).toBe(true);
      expect(status.reason).toBe("FOUNDATION");

      const undefinedStatus = evaluatePrerequisite(undefined, completedCourses);
      expect(undefinedStatus.unlocked).toBe(true);
      expect(undefinedStatus.reason).toBe("FOUNDATION");
    });

    it("should lock a course when the prerequisite has not been completed", () => {
      const completedCourses = new Set<string>(["course-intro-ai"]);
      const prerequisiteCourseId = "course-deep-learning-foundations";

      const status = evaluatePrerequisite(prerequisiteCourseId, completedCourses);
      expect(status.unlocked).toBe(false);
      expect(status.reason).toBe("PREREQUISITE_LOCKED");
    });

    it("should unlock a course when the prerequisite is present in completed courses", () => {
      const completedCourses = new Set<string>([
        "course-intro-ai",
        "course-deep-learning-foundations",
      ]);
      const prerequisiteCourseId = "course-deep-learning-foundations";

      const status = evaluatePrerequisite(prerequisiteCourseId, completedCourses);
      expect(status.unlocked).toBe(true);
      expect(status.reason).toBe("PREREQUISITE_SATISFIED");
    });

    it("should correctly handle multi-tier dependency chains", () => {
      // Chain: Course 1 -> Course 2 -> Course 3
      const c1Id = "c1-foundations";
      const c2Id = "c2-intermediate";
      const c3Id = "c3-advanced";

      const completed = new Set<string>();

      // Initially, only C1 is unlocked
      expect(evaluatePrerequisite(null, completed).unlocked).toBe(true);
      expect(evaluatePrerequisite(c1Id, completed).unlocked).toBe(false);
      expect(evaluatePrerequisite(c2Id, completed).unlocked).toBe(false);

      // Complete C1 -> unlocks C2, but C3 remains locked
      completed.add(c1Id);
      expect(evaluatePrerequisite(c1Id, completed).unlocked).toBe(true);
      expect(evaluatePrerequisite(c2Id, completed).unlocked).toBe(false);

      // Complete C2 -> unlocks C3
      completed.add(c2Id);
      expect(evaluatePrerequisite(c2Id, completed).unlocked).toBe(true);

      // Complete C3 -> unlocks downstream
      completed.add(c3Id);
      expect(evaluatePrerequisite(c3Id, completed).unlocked).toBe(true);
    });
  });

  /* ==========================================================================
     3. Quiz Scoring & Passing Threshold
     ========================================================================== */
  describe("Quiz Scoring Engine", () => {
    const sampleQuestions = [
      { id: "q1", correctOptionId: "opt-1-b" },
      { id: "q2", correctOptionId: "opt-2-a" },
      { id: "q3", correctOptionId: "opt-3-d" },
      { id: "q4", correctOptionId: "opt-4-c" },
      { id: "q5", correctOptionId: "opt-5-a" },
    ];

    it("should award 100% and pass when all answers are correct", () => {
      const answers = {
        q1: "opt-1-b",
        q2: "opt-2-a",
        q3: "opt-3-d",
        q4: "opt-4-c",
        q5: "opt-5-a",
      };

      const result = scoreQuizAttempt(sampleQuestions, answers, 80);
      expect(result.score).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.correctCount).toBe(5);
      expect(result.totalQuestions).toBe(5);
    });

    it("should award 0% and fail when all answers are incorrect", () => {
      const answers = {
        q1: "opt-wrong",
        q2: "opt-wrong",
        q3: "opt-wrong",
        q4: "opt-wrong",
        q5: "opt-wrong",
      };

      const result = scoreQuizAttempt(sampleQuestions, answers, 80);
      expect(result.score).toBe(0);
      expect(result.passed).toBe(false);
      expect(result.correctCount).toBe(0);
    });

    it("should correctly evaluate pass/fail around boundary thresholds", () => {
      // 4 out of 5 = 80%
      const fourCorrect = {
        q1: "opt-1-b",
        q2: "opt-2-a",
        q3: "opt-3-d",
        q4: "opt-4-c",
        q5: "opt-wrong",
      };

      const passAt80 = scoreQuizAttempt(sampleQuestions, fourCorrect, 80);
      expect(passAt80.score).toBe(80);
      expect(passAt80.passed).toBe(true);

      const failAt85 = scoreQuizAttempt(sampleQuestions, fourCorrect, 85);
      expect(failAt85.score).toBe(80);
      expect(failAt85.passed).toBe(false);

      // 3 out of 5 = 60%
      const threeCorrect = {
        q1: "opt-1-b",
        q2: "opt-2-a",
        q3: "opt-3-d",
        q4: "opt-wrong",
        q5: "opt-wrong",
      };
      const failAt80 = scoreQuizAttempt(sampleQuestions, threeCorrect, 80);
      expect(failAt80.score).toBe(60);
      expect(failAt80.passed).toBe(false);
    });

    it("should handle empty question arrays gracefully", () => {
      const result = scoreQuizAttempt([], {}, 80);
      expect(result.score).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.totalQuestions).toBe(0);
    });
  });

  /* ==========================================================================
     4. Certificate Generation & Verification Logic
     ========================================================================== */
  describe("Certificate Generation & Verification", () => {
    it("should generate certificate numbers matching IFELSE-CERT-YYYY-[0-9A-F]{8}", () => {
      const certNumber = generateCertificateNumber(2026);
      expect(certNumber).toMatch(CERTIFICATE_REGEX);
      expect(certNumber.startsWith("IFELSE-CERT-2026-")).toBe(true);
      expect(isValidCertificateNumber(certNumber)).toBe(true);
    });

    it("should generate cryptographically unique, unguessable identifiers", () => {
      const set = new Set<string>();
      const iterations = 50;

      for (let i = 0; i < iterations; i++) {
        const id = generateCertificateNumber();
        expect(set.has(id)).toBe(false);
        set.add(id);
      }

      expect(set.size).toBe(iterations);
    });

    it("should validate well-formed certificate identifiers and reject invalid ones", () => {
      expect(isValidCertificateNumber("IFELSE-CERT-2026-A1B2C3D4")).toBe(true);
      expect(isValidCertificateNumber("IFELSE-CERT-2024-DEADBEEF")).toBe(true);

      // Rejected patterns
      expect(isValidCertificateNumber("CERT-2026-A1B2C3D4")).toBe(false);
      expect(isValidCertificateNumber("IFELSE-CERT-26-A1B2C3D4")).toBe(false);
      expect(isValidCertificateNumber("IFELSE-CERT-2026-xyz12345")).toBe(false); // lowercase
      expect(isValidCertificateNumber("IFELSE-CERT-2026-TOOLONG123")).toBe(false);
      expect(isValidCertificateNumber("")).toBe(false);
      expect(isValidCertificateNumber(null as unknown as string)).toBe(false);
      expect(isValidCertificateNumber(undefined as unknown as string)).toBe(false);
    });
  });
});

"use server";

import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { EnrollmentStatus } from "@generated/prisma/client";
import { generateCertificateNumber } from "@/lib/curriculum-rules";

export async function toggleLessonCompletionAction(
  lessonId: string,
  courseId: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  // Get current progress
  const current = await db.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
  });

  const nextState = !current?.completed;

  await db.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    update: {
      completed: nextState,
      completedAt: nextState ? new Date() : null,
    },
    create: {
      userId: user.id,
      lessonId,
      completed: nextState,
      completedAt: nextState ? new Date() : null,
    },
  });

  // Recalculate enrollment progress
  const allLessons = await db.lesson.findMany({
    where: { module: { courseId } },
    select: { id: true },
  });

  const completedLessons = await db.lessonProgress.count({
    where: {
      userId: user.id,
      lesson: { module: { courseId } },
      completed: true,
    },
  });

  const total = allLessons.length;
  const percentage = total > 0 ? Math.round((completedLessons / total) * 100) : 0;
  const isComplete = percentage >= 100;

  await db.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    update: {
      progressPercentage: percentage,
      status: isComplete ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
      completedAt: isComplete ? new Date() : null,
    },
    create: {
      userId: user.id,
      courseId,
      progressPercentage: percentage,
      status: isComplete ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
      completedAt: isComplete ? new Date() : null,
    },
  });

  // If completed 100% and no certificate exists, generate certificate!
  if (isComplete) {
    const existingCert = await db.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!existingCert) {
      const certNumber = generateCertificateNumber();
      const hash = crypto.randomBytes(24).toString("hex");

      await db.certificate.create({
        data: {
          certificateNumber: certNumber,
          userId: user.id,
          courseId,
          verificationHash: hash,
        },
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/learn", "layout");
}

export async function updateLessonNotesAction(lessonId: string, notes: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  await db.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    update: { notes },
    create: {
      userId: user.id,
      lessonId,
      notes,
    },
  });

  revalidatePath("/learn", "layout");
}

export async function toggleLessonBookmarkAction(lessonId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const current = await db.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
  });

  const nextState = !current?.isBookmarked;

  await db.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId,
      },
    },
    update: { isBookmarked: nextState },
    create: {
      userId: user.id,
      lessonId,
      isBookmarked: nextState,
    },
  });

  revalidatePath("/learn", "layout");
  revalidatePath("/dashboard");
}

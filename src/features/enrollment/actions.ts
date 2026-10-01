"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { EnrollmentStatus } from "@generated/prisma/client";

export async function enrollInCourseAction(courseId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/auth/signin?callbackUrl=/courses`);
  }

  // Check if course exists and has lessons
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  const firstLesson = course.modules[0]?.lessons[0];

  // Check existing enrollment
  const existing = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (!existing) {
    await db.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: EnrollmentStatus.ACTIVE,
        progressPercentage: 0,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/courses/${course.slug}`);

  if (firstLesson) {
    redirect(`/learn/${course.slug}/${firstLesson.slug}`);
  } else {
    redirect(`/dashboard`);
  }
}

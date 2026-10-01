"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Role, Level, LessonType, SubmissionStatus } from "@generated/prisma/client";

const courseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  category: z.string().min(2),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  coverImage: z.string().url(),
  durationMinutes: z.coerce.number().min(10),
  published: z.boolean().default(false),
});

export async function createCourseAction(formData: FormData) {
  const user = await requireRole([Role.INSTRUCTOR, Role.ADMIN]);

  const raw = {
    title: formData.get("title"),
    slug: (formData.get("slug") as string)?.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    category: formData.get("category"),
    level: formData.get("level"),
    coverImage: formData.get("coverImage") || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    durationMinutes: formData.get("durationMinutes") || 120,
    published: formData.get("published") === "on",
  };

  const parsed = courseSchema.parse(raw);

  const course = await db.course.create({
    data: {
      ...parsed,
      level: parsed.level as Level,
      instructorId: user.id,
      approved: user.role === Role.ADMIN, // Admins auto-approve
    },
  });

  revalidatePath("/studio");
  revalidatePath("/catalog");
  redirect(`/studio/courses/${course.id}`);
}

export async function addModuleAction(courseId: string, formData: FormData) {
  const user = await requireRole([Role.INSTRUCTOR, Role.ADMIN]);

  if (user.role !== Role.ADMIN) {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true },
    });
    if (!course || course.instructorId !== user.id) {
      throw new Error("Unauthorized: You can only modify courses you own.");
    }
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  const count = await db.module.count({ where: { courseId } });

  await db.module.create({
    data: {
      courseId,
      title: title.trim(),
      description: description?.trim() || null,
      order: count + 1,
    },
  });

  revalidatePath(`/studio/courses/${courseId}`);
}

export async function addLessonAction(moduleId: string, courseId: string, formData: FormData) {
  const user = await requireRole([Role.INSTRUCTOR, Role.ADMIN]);

  if (user.role !== Role.ADMIN) {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true },
    });
    if (!course || course.instructorId !== user.id) {
      throw new Error("Unauthorized: You can only modify courses you own.");
    }
  }

  const title = formData.get("title") as string;
  const contentType = (formData.get("contentType") as LessonType) || LessonType.TEXT;
  const durationMinutes = Number(formData.get("durationMinutes") || 15);
  const markdownContent = (formData.get("markdownContent") as string) || "";
  const codeSnippet = (formData.get("codeSnippet") as string) || "";
  const isFreePreview = formData.get("isFreePreview") === "on";

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-");

  const count = await db.lesson.count({ where: { moduleId } });

  await db.lesson.create({
    data: {
      moduleId,
      title: title.trim(),
      slug,
      contentType,
      durationMinutes,
      markdownContent,
      codeSnippet: codeSnippet || null,
      isFreePreview,
      order: count + 1,
    },
  });

  revalidatePath(`/studio/courses/${courseId}`);
}

export async function gradeSubmissionAction(
  submissionId: string,
  grade: number,
  feedback: string
) {
  const user = await requireRole([Role.INSTRUCTOR, Role.ADMIN]);

  await db.submission.update({
    where: { id: submissionId },
    data: {
      grade,
      feedback: feedback.trim(),
      status: grade >= 70 ? SubmissionStatus.GRADED : SubmissionStatus.REJECTED,
      gradedAt: new Date(),
      gradedById: user.id,
    },
  });

  revalidatePath("/studio/grading");
}

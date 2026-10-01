"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Role } from "@generated/prisma/client";

export async function toggleCourseApprovalAction(courseId: string) {
  await requireRole([Role.ADMIN]);

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { approved: true },
  });

  if (!course) throw new Error("Course not found");

  await db.course.update({
    where: { id: courseId },
    data: { approved: !course.approved },
  });

  revalidatePath("/admin");
  revalidatePath("/catalog");
}

export async function changeUserRoleAction(userId: string, newRole: Role) {
  await requireRole([Role.ADMIN]);

  await db.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin");
}

export async function publishAnnouncementAction(
  title: string,
  content: string,
  courseId?: string
) {
  const admin = await requireRole([Role.ADMIN]);

  await db.announcement.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      authorId: admin.id,
      courseId: courseId && courseId !== "global" ? courseId : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

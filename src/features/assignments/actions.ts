"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { SubmissionStatus } from "@generated/prisma/client";

export async function submitAssignmentAction(
  assignmentId: string,
  content: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  if (!content || content.trim().length < 10) {
    throw new Error("Submission content must be at least 10 characters.");
  }

  const existing = await db.submission.findFirst({
    where: { assignmentId, userId: user.id },
  });

  if (existing) {
    await db.submission.update({
      where: { id: existing.id },
      data: {
        content: content.trim(),
        status: SubmissionStatus.PENDING,
        submittedAt: new Date(),
      },
    });
  } else {
    await db.submission.create({
      data: {
        assignmentId,
        userId: user.id,
        content: content.trim(),
        status: SubmissionStatus.PENDING,
      },
    });
  }

  revalidatePath("/learn", "layout");
}

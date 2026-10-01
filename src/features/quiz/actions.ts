"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { toggleLessonCompletionAction } from "@/features/progress/actions";
import { scoreQuizAttempt } from "@/lib/curriculum-rules";

export async function submitQuizAttemptAction(
  quizId: string,
  answers: Record<string, string> // questionId -> optionId
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");

  const quiz = await db.quiz.findUnique({
    where: { id: quizId },
    include: {
      lesson: {
        include: { module: true },
      },
      questions: {
        include: { options: true },
      },
    },
  });

  if (!quiz) throw new Error("Quiz not found");

  const questionItems = quiz.questions.map((q) => {
    const correctOpt = q.options.find((o) => o.isCorrect);
    return { id: q.id, correctOptionId: correctOpt?.id || "" };
  });

  const { score: scorePercentage, passed, correctCount, totalQuestions } = scoreQuizAttempt(
    questionItems,
    answers,
    quiz.passingScore
  );

  await db.quizAttempt.create({
    data: {
      quizId,
      userId: user.id,
      score: scorePercentage,
      passed,
      answersJson: JSON.stringify(answers),
    },
  });

  // If passed, mark the lesson as completed!
  if (passed) {
    await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: quiz.lessonId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId: quiz.lessonId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Recompute course progress
    await toggleLessonCompletionAction(quiz.lessonId, quiz.lesson.module.courseId);
  }

  revalidatePath("/learn", "layout");
  return {
    score: scorePercentage,
    passed,
    passingScore: quiz.passingScore,
    correctCount,
    totalQuestions,
  };
}

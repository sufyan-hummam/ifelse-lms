import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@generated/prisma/client";
import { gradeSubmissionAction } from "@/features/instructor/actions";
import { ArrowLeft, FileCheck, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Grading Queue | Instructor Studio",
};

export default async function GradingQueuePage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.INSTRUCTOR && user.role !== Role.ADMIN)) {
    redirect("/dashboard");
  }

  const submissions = await db.submission.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      assignment: {
        include: {
          lesson: {
            include: { module: { include: { course: true } } },
          },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="space-y-3 border-b border-border/60 pb-6">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold">
                <FileCheck className="w-3.5 h-3.5" />
                <span>EVALUATION QUEUE // STUDENT SUBMISSIONS</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
                Capstone Project Grading
              </h1>
            </div>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-xl border border-border/80">
            <p className="text-sm text-muted-foreground">
              No student submissions currently in queue.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((sub) => (
              <Card key={sub.id} glass className="border-border/80 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-brand-blue-light font-bold">
                        {sub.assignment.lesson.module.course.title}
                      </span>
                      <span>•</span>
                      <span className="text-xs text-muted-foreground">
                        {sub.assignment.title}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mt-0.5">
                      Student: {sub.user.name || sub.user.email}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        sub.status === "GRADED"
                          ? "emerald"
                          : sub.status === "REJECTED"
                          ? "rose"
                          : "amber"
                      }
                    >
                      {sub.status}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      Submitted {formatDate(sub.submittedAt)}
                    </span>
                  </div>
                </div>

                {/* Submission Content */}
                <div>
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    STUDENT SUBMISSION
                  </h4>
                  <pre className="text-xs text-foreground/90 whitespace-pre-wrap font-mono bg-secondary/30 p-4 rounded-xl border border-border/60 leading-relaxed">
                    {sub.content}
                  </pre>
                </div>

                {/* Grade Form */}
                <form
                  action={async (formData: FormData) => {
                    "use server";
                    const grade = Number(formData.get("grade"));
                    const feedback = formData.get("feedback") as string;
                    await gradeSubmissionAction(sub.id, grade, feedback);
                  }}
                  className="pt-4 border-t border-border/60 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-mono text-foreground font-semibold">
                        SCORE (0-100)
                      </label>
                      <Input
                        type="number"
                        name="grade"
                        defaultValue={sub.grade ?? 90}
                        min={0}
                        max={100}
                        required
                        className="h-9 font-mono text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-xs font-mono text-foreground font-semibold">
                        INSTRUCTOR FEEDBACK
                      </label>
                      <Input
                        name="feedback"
                        defaultValue={sub.feedback ?? ""}
                        placeholder="Provide rigorous technical critique and improvement recommendations..."
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" variant="electric" size="sm" className="font-mono text-xs">
                      <Send className="w-3 h-3 mr-1" />
                      <span>{sub.status === "GRADED" ? "Update Grade" : "Submit Grade & Feedback"}</span>
                    </Button>
                  </div>
                </form>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

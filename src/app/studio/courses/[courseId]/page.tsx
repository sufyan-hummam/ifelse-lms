import * as React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@generated/prisma/client";
import {
  addModuleAction,
  addLessonAction,
} from "@/features/instructor/actions";
import { ArrowLeft } from "lucide-react";

interface CourseStudioProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseStudioCurriculumPage({ params }: CourseStudioProps) {
  const { courseId } = await params;
  const user = await getCurrentUser();

  if (!user || (user.role !== Role.INSTRUCTOR && user.role !== Role.ADMIN)) {
    redirect("/dashboard");
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              quiz: {
                include: { questions: { include: { options: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  if (user.role !== Role.ADMIN && course.instructorId !== user.id) {
    redirect("/studio?error=unauthorized");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Top Header */}
        <div className="space-y-3 border-b border-border/60 pb-6">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Studio</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="logic">{course.category}</Badge>
                <Badge variant={course.published ? "emerald" : "outline"}>
                  {course.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
                {course.title}
              </h1>
            </div>

            <Link href={`/courses/${course.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="font-mono text-xs">
                View Public Page ↗
              </Button>
            </Link>
          </div>
        </div>

        {/* Modules & Lessons List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">
              Curriculum Modules ({course.modules.length})
            </h2>
          </div>

          {course.modules.map((mod, mIdx) => (
            <div
              key={mod.id}
              className="glass-card rounded-2xl border border-border/80 overflow-hidden"
            >
              {/* Module Header */}
              <div className="p-5 border-b border-border/60 bg-secondary/30 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-brand-blue uppercase">
                    MODULE 0{mIdx + 1}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {mod.title}
                  </h3>
                  {mod.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mod.description}
                    </p>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {mod.lessons.length} Lessons
                </span>
              </div>

              {/* Lessons inside Module */}
              <div className="divide-y divide-border/60 p-2">
                {mod.lessons.map((les, lIdx) => (
                  <div
                    key={les.id}
                    className="p-3 flex items-center justify-between hover:bg-secondary/40 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted-foreground">
                        {mIdx + 1}.{lIdx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{les.title}</p>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground mt-0.5">
                          <span className="uppercase text-brand-blue-light">
                            {les.contentType}
                          </span>
                          <span>•</span>
                          <span>{les.durationMinutes} mins</span>
                          {les.isFreePreview && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400">FREE PREVIEW</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link href={`/learn/${course.slug}/${les.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="h-7 text-xs font-mono">
                        Preview →
                      </Button>
                    </Link>
                  </div>
                ))}

                {/* Add Lesson Form Inside Module */}
                <form
                  action={addLessonAction.bind(null, mod.id, course.id)}
                  className="p-4 bg-secondary/20 rounded-xl border border-dashed border-border/80 mt-3 space-y-3"
                >
                  <span className="font-mono text-xs text-brand-blue font-semibold uppercase">
                    + Add New Lesson to Module {mIdx + 1}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Input
                        name="title"
                        placeholder="Lesson title (e.g. Cross-Encoder Re-ranking In Depth)..."
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                    <div>
                      <select
                        name="contentType"
                        className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs font-mono text-foreground"
                      >
                        <option value="TEXT">Text / Markdown</option>
                        <option value="CODE_PLAYGROUND">Code Playground</option>
                        <option value="QUIZ">Quiz Assessment</option>
                        <option value="VIDEO">Video Lecture</option>
                      </select>
                    </div>
                  </div>

                  <Textarea
                    name="markdownContent"
                    placeholder="Lesson text, mathematical formulas, and architectural theory..."
                    className="h-20 text-xs font-mono"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <input type="checkbox" name="isFreePreview" className="rounded" />
                      <span>Allow Free Public Preview</span>
                    </label>

                    <Button type="submit" variant="electric" size="sm" className="h-8 font-mono text-xs">
                      Add Lesson
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ))}

          {/* Add Module Box */}
          <Card glass className="border-border/80 p-6 space-y-4">
            <span className="font-mono text-xs text-emerald-400 font-semibold uppercase">
              + Append New Module To Curriculum
            </span>

            <form
              action={addModuleAction.bind(null, course.id)}
              className="space-y-4"
            >
              <Input
                name="title"
                placeholder="Module Title (e.g. Scaling Vector Databases with pgvector & HNSW)..."
                required
              />
              <Input
                name="description"
                placeholder="Short module objective & summary..."
              />
              <Button type="submit" variant="electric" size="sm" className="font-mono text-xs">
                Add Module
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

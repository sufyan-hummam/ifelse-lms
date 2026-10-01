import * as React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { QuizRunner } from "@/features/player/quiz-runner";

const CodePlayground = dynamic(
  () => import("@/features/player/code-playground").then((mod) => mod.CodePlayground),
  {
    loading: () => (
      <div className="rounded-xl border border-border/70 bg-card p-8 font-mono text-xs text-muted-foreground animate-pulse flex items-center justify-center min-h-[220px]">
        Loading sandboxed execution engine...
      </div>
    ),
  }
);
import { AssignmentSubmitter } from "@/features/player/assignment-submitter";
import { LessonNotes } from "@/features/player/lesson-notes";
import { StudyBuddy } from "@/features/ai-buddy/study-buddy";
import { toggleLessonCompletionAction } from "@/features/progress/actions";
import { formatDuration } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  FileCode,
  HelpCircle,
  BookOpen,
  Check,
  ArrowLeft,
  Award,
} from "lucide-react";

interface PlayerPageProps {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { courseSlug } = await params;
  return {
    title: `Lesson Player | ${courseSlug}`,
  };
}

export default async function CoursePlayerPage({ params }: PlayerPageProps) {
  const { courseSlug, lessonSlug } = await params;
  const user = await getCurrentUser();

  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: user ? { where: { userId: user.id } } : false,
              quiz: {
                include: {
                  questions: {
                    include: { options: true },
                    orderBy: { order: "asc" },
                  },
                },
              },
              assignment: {
                include: {
                  submissions: user ? { where: { userId: user.id } } : false,
                },
              },
            },
          },
        },
      },
      enrollments: user ? { where: { userId: user.id } } : false,
    },
  });

  if (!course) notFound();

  type CourseData = NonNullable<typeof course>;
  type LessonType = CourseData["modules"][number]["lessons"][number];
  interface FlatLesson extends LessonType {
    moduleIndex: number;
    lessonIndex: number;
    moduleTitle: string;
  }

  // Find the current lesson
  let currentLesson: LessonType | null = null;
  let currentModuleIndex = 0;
  let currentLessonIndex = 0;

  // Flatten all lessons to compute previous and next
  const flatLessons: FlatLesson[] = [];
  for (let mIdx = 0; mIdx < course.modules.length; mIdx++) {
    const mod = course.modules[mIdx];
    for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
      const les = mod.lessons[lIdx];
      flatLessons.push({
        ...les,
        moduleIndex: mIdx,
        lessonIndex: lIdx,
        moduleTitle: mod.title,
      });
      if (les.slug === lessonSlug) {
        currentLesson = les;
        currentModuleIndex = mIdx;
        currentLessonIndex = lIdx;
      }
    }
  }

  if (!currentLesson) notFound();

  const enrollment = course.enrollments?.[0];
  const isEnrolled = Boolean(enrollment);

  // If not enrolled and not free preview, redirect to course detail
  if (!isEnrolled && !currentLesson.isFreePreview) {
    redirect(`/courses/${course.slug}`);
  }

  const currentIndex = flatLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  const currentProgress = currentLesson.progress?.[0];
  const isCompleted = Boolean(currentProgress?.completed);

  // Lesson Type icon helper
  const renderLessonIcon = (type: string) => {
    switch (type) {
      case "CODE_PLAYGROUND":
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case "QUIZ":
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case "VIDEO":
        return <PlayCircle className="w-4 h-4 text-brand-blue-light" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      {/* SIDEBAR: Curriculum Navigation */}
      <aside className="w-full lg:w-80 border-r border-border/80 bg-card/60 backdrop-blur-md flex flex-col shrink-0 lg:h-screen lg:sticky lg:top-0">
        <div className="p-4 border-b border-border/60 space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <div>
            <h2 className="font-display font-bold text-sm text-foreground truncate">
              {course.title}
            </h2>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-1.5">
              <span>Course Progress</span>
              <span className="font-bold text-brand-blue-light">
                {enrollment?.progressPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-brand-blue h-full rounded-full transition-all duration-300"
                style={{ width: `${enrollment?.progressPercentage || 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Modules & Lessons List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {course.modules.map((m, mIdx) => (
            <div key={m.id} className="py-2">
              <div className="px-4 py-2 font-mono text-[10px] uppercase font-bold text-muted-foreground">
                Module {mIdx + 1}: {m.title}
              </div>

              <div className="space-y-0.5 px-2">
                {m.lessons.map((les) => {
                  const isActive = les.slug === currentLesson.slug;
                  const lesCompleted = les.progress?.[0]?.completed;

                  return (
                    <Link
                      key={les.id}
                      href={`/learn/${course.slug}/${les.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                        isActive
                          ? "bg-brand-blue/15 text-foreground font-semibold border border-brand-blue/30"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {renderLessonIcon(les.contentType)}
                        <span className="truncate">{les.title}</span>
                      </div>

                      <div className="shrink-0 ml-2">
                        {lesCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : les.isFreePreview && !isEnrolled ? (
                          <span className="font-mono text-[9px] text-brand-sky uppercase">
                            Free
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Action Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 h-16 border-b border-border/80 glass-panel">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
              Module {currentModuleIndex + 1}.{currentLessonIndex + 1}
            </span>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <h1 className="font-display text-sm sm:text-base font-bold text-foreground truncate">
              {currentLesson.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user && (
              <LessonNotes
                lessonId={currentLesson.id}
                initialNotes={currentProgress?.notes}
                initialBookmarked={currentProgress?.isBookmarked}
              />
            )}

            {user && (
              <form
                action={async () => {
                  "use server";
                  await toggleLessonCompletionAction(currentLesson.id, course.id);
                }}
              >
                <Button
                  type="submit"
                  variant={isCompleted ? "outline" : "electric"}
                  size="sm"
                  className="h-9 gap-1.5 text-xs font-mono"
                >
                  <Check
                    className={`w-3.5 h-3.5 ${
                      isCompleted ? "text-emerald-400" : "text-white"
                    }`}
                  />
                  <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Lesson Body Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8 flex-1">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="logic">
                {currentLesson.contentType.replace("_", " ")}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                {formatDuration(currentLesson.durationMinutes)}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground">
              {currentLesson.title}
            </h2>
          </div>

          {/* Markdown Lesson Content */}
          <div className="prose prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4">
            {currentLesson.markdownContent ? (
              <div className="space-y-4 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {currentLesson.markdownContent}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Follow along with the interactive components below.
              </p>
            )}
          </div>

          {/* Interactive Code Playground (if applicable) */}
          {currentLesson.contentType === "CODE_PLAYGROUND" && currentLesson.codeSnippet && (
            <CodePlayground
              initialCode={currentLesson.codeSnippet}
              language={currentLesson.language || "python"}
              lessonTitle={currentLesson.title}
            />
          )}

          {/* Interactive Quiz (if attached) */}
          {currentLesson.quiz && <QuizRunner quiz={currentLesson.quiz} />}

          {/* Assignment Submitter (if attached) */}
          {currentLesson.assignment && (
            <AssignmentSubmitter
              assignment={currentLesson.assignment}
              submission={currentLesson.assignment.submissions?.[0]}
            />
          )}

          {/* Bottom Lesson Navigation */}
          <div className="pt-10 border-t border-border/80 flex items-center justify-between">
            {prevLesson ? (
              <Link href={`/learn/${course.slug}/${prevLesson.slug}`}>
                <Button variant="outline" size="sm" className="font-mono text-xs">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Previous</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link href={`/learn/${course.slug}/${nextLesson.slug}`}>
                <Button variant="electric" size="sm" className="font-mono text-xs">
                  <span>Next Lesson</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button variant="electric" size="sm" className="font-mono text-xs">
                  <span>Finish Course</span>
                  <Award className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* AI Study Buddy Floating Assistant */}
        <StudyBuddy
          courseId={course.id}
          courseTitle={course.title}
          lessonId={currentLesson.id}
          lessonTitle={currentLesson.title}
        />
      </main>
    </div>
  );
}

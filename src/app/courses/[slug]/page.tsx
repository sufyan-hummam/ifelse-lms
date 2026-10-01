import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCourseBySlug } from "@/features/courses/queries";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { enrollInCourseAction } from "@/features/enrollment/actions";
import { formatDuration } from "@/lib/utils";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  CheckCircle,
  PlayCircle,
  FileCode,
  HelpCircle,
  ArrowRight,
  Star,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} | IF/ELSE Intelligence`,
    description: course.shortDescription,
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const user = await getCurrentUser();
  const enrollment = user
    ? await db.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      })
    : null;

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const firstLesson = course.modules[0]?.lessons[0];

  const lessonTypeIcon = (type: string) => {
    switch (type) {
      case "CODE_PLAYGROUND":
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case "QUIZ":
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case "VIDEO":
        return <PlayCircle className="w-4 h-4 text-brand-blue-light" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Course Header Banner */}
        <section className="border-b border-border/80 bg-secondary/15 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="logic">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  <span className="font-mono text-xs text-muted-foreground ml-2">
                    IF/ELSE INTELLIGENCE CURRICULUM
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                  {course.title}
                </h1>

                <p className="text-base text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                {/* Course Metadata Row */}
                <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-blue" />
                    <span>{formatDuration(course.durationMinutes)} total</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>{totalLessons} lessons & playgrounds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>{course._count.enrollments} enrolled engineers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-violet-400" />
                    <span>Verifiable Certificate</span>
                  </div>
                </div>
              </div>

              {/* Action / Enrollment Card */}
              <div className="w-full lg:w-80 shrink-0">
                <Card glass className="border-border/80 p-6 space-y-5">
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-2xl font-bold text-foreground">
                      {course.price === 0 ? "FREE // OPEN ACCESS" : `$${course.price}`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full access to course lessons, AI study buddy, and capstone grading.
                    </p>
                  </div>

                  {enrollment ? (
                    <Link
                      href={
                        firstLesson
                          ? `/learn/${course.slug}/${firstLesson.slug}`
                          : `/dashboard`
                      }
                      className="block"
                    >
                      <Button variant="electric" size="lg" className="w-full">
                        <span>Continue Learning</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <form action={enrollInCourseAction.bind(null, course.id)}>
                      <Button type="submit" variant="electric" size="lg" className="w-full">
                        <span>Enroll In Course</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </form>
                  )}

                  <ul className="text-xs text-muted-foreground space-y-2 pt-2 border-t border-border/60">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Course-grounded AI Study Buddy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Interactive browser code execution</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Self-paced with instructor grading</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Syllabus Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left 2 Cols: Syllabus Modules & Lessons */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                  Course Syllabus & Curriculum
                </h2>
                <p className="text-sm text-muted-foreground">
                  {course.modules.length} modules • {totalLessons} lessons
                </p>
              </div>

              <div className="space-y-6">
                {course.modules.map((m, mIdx) => (
                  <div
                    key={m.id}
                    className="glass-card rounded-xl border border-border/80 overflow-hidden"
                  >
                    <div className="p-5 border-b border-border/60 bg-secondary/30">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-blue">
                          Module {mIdx + 1}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {m.lessons.length} Lessons
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-foreground mt-1">
                        {m.title}
                      </h3>
                      {m.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {m.description}
                        </p>
                      )}
                    </div>

                    <div className="divide-y divide-border/60">
                      {m.lessons.map((lesson, lIdx) => {
                        const canAccess = Boolean(enrollment || lesson.isFreePreview);

                        return (
                          <div
                            key={lesson.id}
                            className="p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="shrink-0">{lessonTypeIcon(lesson.contentType)}</div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-muted-foreground">
                                    {mIdx + 1}.{lIdx + 1}
                                  </span>
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {lesson.title}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px] text-muted-foreground">
                                  <span>{lesson.durationMinutes} mins</span>
                                  <span>•</span>
                                  <span className="uppercase text-[10px]">
                                    {lesson.contentType.replace("_", " ")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {lesson.isFreePreview && !enrollment && (
                                <Badge variant="electric" className="text-[10px]">
                                  Free Preview
                                </Badge>
                              )}
                              {canAccess ? (
                                <Link href={`/learn/${course.slug}/${lesson.slug}`}>
                                  <Button variant="ghost" size="sm" className="h-8 text-xs font-mono">
                                    Start →
                                  </Button>
                                </Link>
                              ) : (
                                <span className="font-mono text-[11px] text-muted-foreground px-2">
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviews Section */}
              <div className="pt-8 border-t border-border/80 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Engineer Reviews & Feedback
                  </h3>
                  <div className="flex items-center gap-1 font-mono text-xs text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">5.0</span>
                    <span className="text-muted-foreground">({course.reviews.length} reviews)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {course.reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      No reviews submitted yet for this course.
                    </p>
                  ) : (
                    course.reviews.map((r) => (
                      <div
                        key={r.id}
                        className="glass-card p-5 rounded-xl border border-border/80 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center font-mono text-xs font-bold text-brand-sky">
                              {r.user.name?.slice(0, 1) || "U"}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">{r.user.name}</p>
                              {r.user.headline && (
                                <p className="text-[11px] text-muted-foreground">{r.user.headline}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed italic">
                          &ldquo;{r.comment}&rdquo;
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Instructor Profile & Credentials */}
            <div className="space-y-6">
              <Card glass className="border-border/80 p-6 space-y-4">
                <span className="font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
                  COURSE INSTRUCTOR
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-brand-blue/20 border-2 border-brand-blue/30 flex items-center justify-center text-lg font-mono font-bold text-brand-sky">
                    {course.instructor.name?.slice(0, 1) || "I"}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-foreground">
                      {course.instructor.name}
                    </h4>
                    <p className="text-xs text-brand-sky font-mono">
                      {course.instructor.headline}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {course.instructor.bio}
                </p>

                <div className="pt-2 border-t border-border/60 flex items-center gap-4 font-mono text-xs text-muted-foreground">
                  {course.instructor.githubUrl && (
                    <a
                      href={course.instructor.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground flex items-center gap-1"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 text-brand-blue" />
                    </a>
                  )}
                  {course.instructor.linkedinUrl && (
                    <a
                      href={course.instructor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground flex items-center gap-1"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3 text-brand-blue" />
                    </a>
                  )}
                </div>
              </Card>

              {/* Lab Certification Box */}
              <div className="glass-card p-6 rounded-xl border border-border/80 space-y-3">
                <ShieldCheck className="w-8 h-8 text-brand-blue" />
                <h4 className="font-display font-semibold text-foreground">
                  IF/ELSE Intelligence Verified
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Passing this curriculum verifies engineering capability according to
                  IF/ELSE Intelligence commercial standards. Certificates include an on-chain/cryptographic
                  verification hash.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

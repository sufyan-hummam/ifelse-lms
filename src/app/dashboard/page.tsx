import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { getCurrentUser } from "@/lib/auth";
import { getStudentDashboardData } from "@/features/dashboard/queries";
import { SkillGraph, type SkillNode } from "@/features/dashboard/skill-graph";
import {
  Flame,
  BookOpen,
  Award,
  ArrowRight,
  Bookmark,
  Bell,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Student Dashboard | IF/ELSE Intelligence LMS",
  description: "Monitor your AI engineering progress, continue lessons, and verify certificates.",
};

export default async function DashboardPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const {
    user,
    enrollments,
    certificates,
    bookmarkedLessons,
    announcements,
    recommendedCourses,
  } = await getStudentDashboardData(sessionUser.id);

  // Determine active course to continue learning
  const activeEnrollment =
    enrollments.find((e) => e.status === "ACTIVE") || enrollments[0];

  // Find next uncompleted lesson
  let nextLesson = null;
  if (activeEnrollment) {
    for (const m of activeEnrollment.course.modules) {
      for (const l of m.lessons) {
        const prog = l.progress[0];
        if (!prog?.completed) {
          nextLesson = l;
          break;
        }
      }
      if (nextLesson) break;
    }
    // If all completed or none found, default to first lesson
    if (!nextLesson) {
      nextLesson = activeEnrollment.course.modules[0]?.lessons[0];
    }
  }

  // Derive dynamic competency skill graph states directly from database enrollments
  const ragEnrollment = enrollments.find((e) => e.course.slug === "production-rag-systems");
  const agentEnrollment = enrollments.find((e) => e.course.slug === "autonomous-ai-agents");
  const ragProgress = ragEnrollment?.progressPercentage || 0;
  const agentProgress = agentEnrollment?.progressPercentage || 0;

  const dynamicSkillNodes: SkillNode[] = [
    {
      id: "node-1",
      name: "Vector Embeddings & Geometries",
      category: "Foundations",
      status: ragProgress > 0 ? "completed" : "locked",
    },
    {
      id: "node-2",
      name: "Contextual Chunking",
      category: "Retrieval",
      status: ragProgress >= 25 ? "completed" : ragProgress > 0 ? "in-progress" : "locked",
      dependsOn: ["node-1"],
    },
    {
      id: "node-3",
      name: "Hybrid BM25 + Dense RRF",
      category: "Retrieval",
      status: ragProgress >= 50 ? "completed" : ragProgress >= 25 ? "in-progress" : "locked",
      dependsOn: ["node-2"],
    },
    {
      id: "node-4",
      name: "Deterministic Agent State Loops",
      category: "Agents",
      status: agentProgress >= 50 ? "completed" : agentProgress > 0 ? "in-progress" : "locked",
    },
    {
      id: "node-5",
      name: "Tool Validation with Zod",
      category: "Agents",
      status: agentProgress >= 80 ? "completed" : agentProgress > 0 ? "in-progress" : "locked",
      dependsOn: ["node-4"],
    },
    {
      id: "node-6",
      name: "Ragas Quantitative Evaluation",
      category: "Production",
      status:
        ragProgress >= 50 && agentProgress >= 50
          ? certificates.length > 0
            ? "completed"
            : "in-progress"
          : "locked",
      dependsOn: ["node-3", "node-5"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Profile & Telemetry Header */}
        <div className="glass-card rounded-2xl border border-border/80 p-6 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 border-2 border-brand-blue/30 flex items-center justify-center font-mono font-bold text-2xl text-brand-sky shadow-lg">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AI"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {user?.name || "Student"}
                  </h1>
                  <Badge variant="logic">{user?.role || "STUDENT"}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {user?.headline || "Applied AI Engineering Fellow"}
                </p>
              </div>
            </div>

            {/* Metrics Counters */}
            <div className="flex items-center gap-4 sm:gap-6 font-mono">
              <div className="glass-card px-4 py-3 rounded-xl border border-border/80 flex items-center gap-3">
                <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {user?.streakCount || 1} Days
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">Streak</div>
                </div>
              </div>

              <div className="glass-card px-4 py-3 rounded-xl border border-border/80 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-brand-blue" />
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {enrollments.length}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">Enrolled</div>
                </div>
              </div>

              <div className="glass-card px-4 py-3 rounded-xl border border-border/80 flex items-center gap-3">
                <Award className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="text-lg font-bold text-foreground">
                    {certificates.length}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase">Certificates</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning Spotlight Banner */}
        {activeEnrollment && (
          <div className="glass-card rounded-2xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 via-secondary/40 to-background p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <ProgressRing
                progress={activeEnrollment.progressPercentage}
                size={76}
                strokeWidth={6}
              />
              <div className="space-y-1">
                <span className="font-mono text-xs text-brand-sky font-semibold uppercase tracking-wider">
                  CONTINUE LEARNING
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {activeEnrollment.course.title}
                </h2>
                {nextLesson && (
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <span>Up Next:</span>
                    <span className="text-foreground font-medium">{nextLesson.title}</span>
                  </p>
                )}
              </div>
            </div>

            {nextLesson && (
              <Link
                href={`/learn/${activeEnrollment.course.slug}/${nextLesson.slug}`}
                className="shrink-0 w-full md:w-auto"
              >
                <Button variant="electric" size="lg" className="w-full md:w-auto">
                  <span>Resume Lesson</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: My Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-foreground">
                My Enrolled Courses ({enrollments.length})
              </h3>
              <Link href="/catalog" className="text-xs font-mono text-brand-sky hover:underline">
                Browse More Courses →
              </Link>
            </div>

            {enrollments.length === 0 ? (
              <div className="glass-card p-8 text-center rounded-xl border border-border/80 space-y-4">
                <BookOpen className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  You are not enrolled in any courses yet.
                </p>
                <Link href="/catalog">
                  <Button variant="electric" size="sm">
                    Explore Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enr) => {
                  const firstL = enr.course.modules[0]?.lessons[0];
                  return (
                    <div
                      key={enr.id}
                      className="glass-card p-5 rounded-xl border border-border/80 hover:border-brand-blue/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-secondary">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={enr.course.coverImage}
                            alt={enr.course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={enr.status === "COMPLETED" ? "emerald" : "logic"}
                              className="text-[10px]"
                            >
                              {enr.status}
                            </Badge>
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {enr.progressPercentage}% Completed
                            </span>
                          </div>
                          <h4 className="font-display text-base font-bold text-foreground truncate">
                            {enr.course.title}
                          </h4>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-2">
                            <div
                              className="bg-brand-blue h-full rounded-full transition-all"
                              style={{ width: `${enr.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {firstL && (
                          <Link href={`/learn/${enr.course.slug}/${firstL.slug}`}>
                            <Button variant="outline" size="sm" className="font-mono text-xs">
                              Player →
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Competency Skill Graph */}
            <SkillGraph nodes={dynamicSkillNodes} />

            {/* Bookmarks Section */}
            {bookmarkedLessons.length > 0 && (
              <div className="pt-6 border-t border-border/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-brand-sky" />
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Saved Lesson Bookmarks ({bookmarkedLessons.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookmarkedLessons.map((b) => (
                    <Link
                      key={b.id}
                      href={`/learn/${b.lesson.module.course.slug}/${b.lesson.slug}`}
                      className="glass-card p-4 rounded-xl border border-border/80 hover:border-brand-blue/50 transition-colors block"
                    >
                      <span className="font-mono text-[10px] text-brand-blue uppercase">
                        {b.lesson.module.course.title}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground mt-0.5 truncate">
                        {b.lesson.title}
                      </h4>
                      {b.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-1 italic mt-1">
                          &ldquo;{b.notes}&rdquo;
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right 1 Col: Certificates, Announcements, Recommended */}
          <div className="space-y-6">
            {/* Certificates Box */}
            <Card glass className="border-border/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-display font-bold text-foreground text-sm">
                    Verified Certificates
                  </h4>
                </div>
                <Link
                  href="/dashboard/certificates"
                  className="font-mono text-[11px] text-brand-sky hover:underline"
                >
                  View All
                </Link>
              </div>

              {certificates.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Complete 100% of a course curriculum and capstone to earn an IF/ELSE verifiable certificate.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {certificates.map((cert) => (
                    <Link
                      key={cert.id}
                      href={`/certificates/${cert.certificateNumber}`}
                      className="block p-3 rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary/60 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">
                          {cert.certificateNumber}
                        </span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <p className="text-xs font-semibold text-foreground truncate mt-0.5">
                        {cert.course.title}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Announcements Box */}
            <Card glass className="border-border/80 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h4 className="font-display font-bold text-foreground text-sm">
                  Lab Announcements
                </h4>
              </div>

              <div className="space-y-3">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-lg border border-border/60 bg-secondary/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-brand-blue-light">
                        {a.author.name}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">
                        {a.course ? a.course.title : "Global"}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {a.content}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommended Next Box */}
            {recommendedCourses.length > 0 && (
              <Card glass className="border-border/80 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-blue" />
                  <h4 className="font-display font-bold text-foreground text-sm">
                    Recommended Next
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {recommendedCourses.map((rec) => (
                    <Link
                      key={rec.id}
                      href={`/courses/${rec.slug}`}
                      className="block p-3 rounded-lg border border-border/60 bg-secondary/30 hover:bg-secondary/60 transition-colors"
                    >
                      <p className="text-xs font-semibold text-foreground truncate">
                        {rec.title}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                        {rec.level} • {rec.modules.length} Modules
                      </p>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

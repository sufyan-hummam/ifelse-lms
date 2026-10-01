import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@generated/prisma/client";
import {
  Palette,
  Plus,
  BookOpen,
  Users,
  FileCheck,
  Edit3,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Instructor Studio | IF/ELSE Intelligence LMS",
  description: "Curriculum authoring, lesson builder, and student grading portal.",
};

export default async function InstructorStudioPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.INSTRUCTOR && user.role !== Role.ADMIN)) {
    redirect("/dashboard?error=unauthorized_studio");
  }

  // Get courses authored or all courses if admin
  const where = user.role === Role.ADMIN ? {} : { instructorId: user.id };

  const courses = await db.course.findMany({
    where,
    include: {
      modules: {
        include: { lessons: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const pendingSubmissions = await db.submission.findMany({
    where: { status: "PENDING" },
    include: {
      user: { select: { name: true, email: true } },
      assignment: { select: { title: true } },
    },
    take: 5,
  });

  const totalEnrollments = courses.reduce((acc, c) => acc + c._count.enrollments, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Studio Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              <Palette className="w-3.5 h-3.5" />
              <span>INSTRUCTOR WORKSPACE // STUDIO</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Curriculum & Course Studio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Create, sequence, and manage lessons, code playgrounds, quizzes, and grading.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/studio/grading">
              <Button variant="outline" size="sm" className="font-mono text-xs">
                <FileCheck className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                <span>Grading Queue ({pendingSubmissions.length})</span>
              </Button>
            </Link>

            <Link href="/studio/courses/new">
              <Button variant="electric" size="sm" className="font-mono text-xs">
                <Plus className="w-4 h-4 mr-1" />
                <span>Create New Course</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Studio Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
          <div className="glass-card p-5 rounded-xl border border-border/80 flex items-center gap-4">
            <BookOpen className="w-8 h-8 text-brand-blue" />
            <div>
              <div className="text-2xl font-bold text-foreground">{courses.length}</div>
              <div className="text-[11px] text-muted-foreground uppercase">Courses Authored</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-border/80 flex items-center gap-4">
            <Users className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-2xl font-bold text-foreground">{totalEnrollments}</div>
              <div className="text-[11px] text-muted-foreground uppercase">Enrolled Students</div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-border/80 flex items-center gap-4">
            <FileCheck className="w-8 h-8 text-amber-400" />
            <div>
              <div className="text-2xl font-bold text-foreground">
                {pendingSubmissions.length}
              </div>
              <div className="text-[11px] text-muted-foreground uppercase">Pending Grading</div>
            </div>
          </div>
        </div>

        {/* Authored Courses List */}
        <div className="space-y-6">
          <h2 className="font-display text-xl font-bold text-foreground">
            My Courses & Curricula
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => {
              const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);

              return (
                <div
                  key={c.id}
                  className="glass-card rounded-xl border border-border/80 p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="logic">{c.category}</Badge>
                      <Badge variant={c.published ? "emerald" : "outline"}>
                        {c.published ? "Published" : "Draft"}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {c.shortDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground pt-2">
                      <span>{c.modules.length} Modules</span>
                      <span>{totalLessons} Lessons</span>
                      <span>{c._count.enrollments} Students</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <Link href={`/courses/${c.slug}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-mono">
                        <span>Preview</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>

                    <Link href={`/studio/courses/${c.id}`}>
                      <Button variant="electric" size="sm" className="h-8 text-xs font-mono">
                        <Edit3 className="w-3 h-3 mr-1" />
                        <span>Curriculum Studio</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

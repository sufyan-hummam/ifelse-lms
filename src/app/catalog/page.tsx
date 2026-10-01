import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getPublishedCourses } from "@/features/courses/queries";
import { Search, BookOpen, Clock, Users, ArrowRight } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { Level } from "@generated/prisma/client";

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    level?: string;
  }>;
}

export const metadata = {
  title: "Course Catalog | IF/ELSE Intelligence LMS",
  description: "Browse comprehensive applied AI engineering courses in RAG, Computer Vision, and Autonomous Agents.",
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const searchQuery = params.q || "";
  const selectedCategory = params.category || "all";
  const selectedLevel = (params.level as Level) || undefined;

  const courses = await getPublishedCourses({
    search: searchQuery,
    category: selectedCategory,
    level: selectedLevel,
  });

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "RAG & GenAI", value: "RAG" },
    { label: "Computer Vision", value: "Vision" },
    { label: "AI Systems & Agents", value: "AI Systems" },
  ];

  const levels: Array<{ label: string; value: Level | "all" }> = [
    { label: "All Levels", value: "all" },
    { label: "Beginner", value: Level.BEGINNER },
    { label: "Intermediate", value: Level.INTERMEDIATE },
    { label: "Advanced", value: Level.ADVANCED },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
            <span>CURRICULUM INDEX // CATALOG</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Applied AI Engineering Courses
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Explore industry-tested curricula designed to take you from foundational logic
            to production AI deployments.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card p-4 rounded-xl border border-border/80 mb-8 space-y-4">
          <form method="GET" action="/catalog" className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={searchQuery}
                placeholder="Search by keywords, models, or topics (e.g. RAG, YOLO, Agents)..."
                className="pl-9 h-10"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <select
                name="category"
                defaultValue={selectedCategory}
                className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                name="level"
                defaultValue={selectedLevel || "all"}
                className="h-10 px-3 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {levels.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>

              <Button type="submit" variant="electric" size="sm" className="h-10 px-4">
                Filter
              </Button>
            </div>
          </form>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-xl border border-border/80 max-w-lg mx-auto space-y-4">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              No courses found
            </h3>
            <p className="text-xs text-muted-foreground">
              No courses matched your query. Try broadening your keywords or resetting filters.
            </p>
            <Link href="/catalog">
              <Button variant="outline" size="sm">
                Clear Filters
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const totalLessons = course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              );

              return (
                <div
                  key={course.id}
                  className="glass-card rounded-xl overflow-hidden flex flex-col border border-border/80 hover:border-brand-blue/50 transition-all duration-300 group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="logic">{course.category}</Badge>
                      <Badge variant="outline" className="bg-background/80 backdrop-blur">
                        {course.level}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-brand-blue-light transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                        {course.shortDescription}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/60">
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-brand-blue" />
                          {totalLessons} Lessons
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          {formatDuration(course.durationMinutes)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          {course._count.enrollments} Enrolled
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center font-bold text-[10px] text-brand-sky font-mono">
                            {course.instructor.name?.slice(0, 1) || "I"}
                          </span>
                          <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                            {course.instructor.name}
                          </span>
                        </div>

                        <Link href={`/courses/${course.slug}`}>
                          <Button variant="electric" size="sm" className="h-8 text-xs font-mono">
                            <span>View Course</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogicBadge } from "@/components/ui/logic-badge";
import { getLearningPaths } from "@/features/courses/queries";
import { Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Learning Paths | IF/ELSE Intelligence LMS",
  description: "Curated applied AI career pathways with strict prerequisite logic.",
};

export default async function LearningPathsPage() {
  const paths = await getLearningPaths();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
            <span>CURATED PATHWAYS // SKILL GRAPHS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Structured Learning Pathways
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Our career tracks enforce conditional prerequisite logic: complete foundational
            architecture before unlocking specialized production systems.
          </p>
        </div>

        <div className="space-y-12">
          {paths.map((path) => (
            <div
              key={path.id}
              className="glass-card rounded-2xl border border-border/80 p-8 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="electric">CAREER TRACK</Badge>
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-blue" />
                      ~{path.estimatedHours} Hours Curriculum
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {path.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    {path.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <Link href={`/catalog`}>
                    <Button variant="electric">
                      <span>Start Pathway</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Branching Sequence Diagram */}
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-blue mb-4">
                  PREREQUISITE DEPENDENCY FLOW
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {path.courses.map((pc, idx) => (
                    <div
                      key={pc.id}
                      className="glass-card p-6 rounded-xl border border-border/80 flex flex-col justify-between space-y-4 relative"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="w-7 h-7 rounded-full bg-brand-blue/20 border border-brand-blue/30 text-brand-sky font-mono text-xs flex items-center justify-center font-bold">
                            0{idx + 1}
                          </span>
                          {pc.prerequisiteCourseId ? (
                            <LogicBadge
                              condition="Course 1 Completed"
                              thenClause="Unlock"
                              elseClause="Locked"
                              state="unlocked"
                            />
                          ) : (
                            <Badge variant="emerald">Foundation Entry</Badge>
                          )}
                        </div>

                        <div>
                          <h4 className="font-display text-lg font-bold text-foreground">
                            {pc.course.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {pc.course.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          Instructor: {pc.course.instructor.name}
                        </span>
                        <Link href={`/courses/${pc.course.slug}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs font-mono">
                            View Syllabus →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

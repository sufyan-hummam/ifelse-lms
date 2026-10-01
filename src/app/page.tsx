import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogicBadge } from "@/components/ui/logic-badge";
import { getFeaturedCourses, getLearningPaths } from "@/features/courses/queries";
import {
  ArrowRight,
  Terminal,
  Bot,
  BrainCircuit,
  Compass,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Award,
} from "lucide-react";

export default async function HomePage() {
  const featuredCourses = await getFeaturedCourses();
  const paths = await getLearningPaths();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-brand-blue/30 selection:text-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 border-b border-border/60">
          {/* Background Ambient Glows & Tech Grid */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-navy via-brand-blue/20 to-brand-sky/15 rounded-full blur-[140px]" />
            <div className="absolute -bottom-20 right-10 w-96 h-96 bg-brand-sky/10 rounded-full blur-[120px]" />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Logic Motif Status Eyebrow */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-secondary/40 px-4 py-1.5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                APPLIED AI ENGINEERING // BEYOND BINARIES
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.12]">
              Engineering Real AI Systems.{" "}
              <span className="bg-gradient-to-r from-brand-sky via-brand-blue to-brand-navy-deep dark:to-brand-sky bg-clip-text text-transparent">
                Beyond Binaries.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master enterprise RAG architectures, multimodal computer vision pipelines,
              and deterministic autonomous agent loops — developed and battle-tested by
              applied AI engineers at IF/ELSE Intelligence.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/catalog">
                <Button variant="electric" size="lg" className="w-full sm:w-auto px-8">
                  <span>Explore Course Catalog</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/paths">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6">
                  <Compass className="w-4 h-4 mr-2 text-brand-blue" />
                  <span>View Learning Paths</span>
                </Button>
              </Link>
              <a
                href="https://www.ifelseintelligence.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-xs font-mono">
                  <span>Main Company Site</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-brand-blue" />
                </Button>
              </a>
            </div>

            {/* Telemetry Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="glass-card p-4 rounded-xl border border-border/80">
                <div className="font-mono text-2xl font-bold text-foreground">100%</div>
                <div className="font-mono text-[11px] text-muted-foreground uppercase mt-1">
                  Production Engineering
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-border/80">
                <div className="font-mono text-2xl font-bold text-brand-blue-light">RAG + VLMs</div>
                <div className="font-mono text-[11px] text-muted-foreground uppercase mt-1">
                  Core Curriculum Focus
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-border/80">
                <div className="font-mono text-2xl font-bold text-emerald-400">Interactive</div>
                <div className="font-mono text-[11px] text-muted-foreground uppercase mt-1">
                  In-Browser Playgrounds
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-border/80">
                <div className="font-mono text-2xl font-bold text-amber-400">Verifiable</div>
                <div className="font-mono text-[11px] text-muted-foreground uppercase mt-1">
                  Cryptographic Certs
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGIC & PHILOSOPHY SECTION */}
        <section className="py-20 border-b border-border/60 bg-secondary/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="font-mono text-xs text-brand-blue font-semibold uppercase tracking-wider mb-2">
                THE IF/ELSE ARCHITECTURE
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Conditional Logic Meets Neural Intelligence
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Raw LLM completions fail without structured guardrails. Our training instills
                how to combine deterministic control flows with state-of-the-art foundation models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-xl border border-border/80 relative">
                <div className="w-10 h-10 rounded-lg bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-4">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="mb-3">
                  <LogicBadge
                    condition="Query Ambiguous"
                    thenClause="Hybrid BM25 + Dense RRF"
                    state="active"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Grounding & Neural Search
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Avoid naive vector cosine search. Learn contextual document chunking,
                  reciprocal rank fusion, and cross-encoder rerankers used in commercial setups.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border/80 relative">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="mb-3">
                  <LogicBadge
                    condition="Tool Input Inferred"
                    thenClause="Validate Zod Schema"
                    state="unlocked"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Deterministic Agent Loops
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Design agent state machines with strict function schema validation, cycle
                  detection, and guaranteed human-in-the-loop fallback hooks.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border/80 relative">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="mb-3">
                  <LogicBadge
                    condition="Prerequisite Met"
                    thenClause="Unlock Specialization"
                    elseClause="Ground Fundamentals"
                    state="neutral"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Adaptive Skill Pathways
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Learning paths employ programmatic prerequisite logic so you always have
                  the necessary foundations before building complex distributed multi-agent systems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED COURSES SECTION */}
        <section className="py-20 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
                  FEATURED CURRICULUM
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-1">
                  Engineered For Production
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                  Explore practical courses with realistic lessons, code playgrounds, and interactive quizzes.
                </p>
              </div>

              <Link href="/catalog">
                <Button variant="outline" size="sm">
                  <span>View All Courses</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
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

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-brand-blue-light transition-colors line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                      {course.shortDescription}
                    </p>

                    <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center font-bold text-[10px] text-brand-sky">
                          {course.instructor.name?.slice(0, 1) || "I"}
                        </span>
                        <span>{course.instructor.name}</span>
                      </div>
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-mono">
                          Details →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEARNING PATHS PREVIEW */}
        <section className="py-20 border-b border-border/60 bg-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
                CURATED CAREER TRACKS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-1">
                Structured Learning Paths
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Move systematically from foundational concepts to advanced production architecture
                with enforced prerequisite logic.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {paths.map((p) => (
                <div
                  key={p.id}
                  className="glass-card p-6 rounded-xl border border-border/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="electric">PATHWAY</Badge>
                      <span className="font-mono text-xs text-muted-foreground">
                        ~{p.estimatedHours} Hours Required
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      {p.shortDescription}
                    </p>

                    {/* Step Nodes */}
                    <div className="space-y-3 mb-6">
                      {p.courses.map((pc, idx) => (
                        <div
                          key={pc.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-secondary/40"
                        >
                          <span className="w-6 h-6 rounded-full bg-brand-blue/20 text-brand-blue-light font-mono text-xs flex items-center justify-center font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {pc.course.title}
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground">
                              {pc.prerequisiteCourseId
                                ? "IF Previous Complete THEN Unlocked"
                                : "Starting Course"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={`/paths`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Path Roadmap
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIFFERENTIATORS GRID */}
        <section className="py-20 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
                THE IF/ELSE ADVANTAGE
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-1">
                Built For Serious AI Engineers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-xl border border-border/80 space-y-3">
                <Bot className="w-8 h-8 text-brand-blue" />
                <h4 className="font-display font-semibold text-foreground">AI Study Buddy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Per-course Gemini RAG assistant trained specifically on that course&apos;s lessons,
                  citing exact references.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border/80 space-y-3">
                <Terminal className="w-8 h-8 text-emerald-400" />
                <h4 className="font-display font-semibold text-foreground">In-Browser Playground</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Run and tweak chunking, tokenization, and validation algorithms directly inside
                  lesson pages.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border/80 space-y-3">
                <Layers className="w-8 h-8 text-amber-400" />
                <h4 className="font-display font-semibold text-foreground">Skill-Graph Maps</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Visual node graphs tracking your mastery across vector retrieval, agents, and vision.
                </p>
              </div>

              <div className="glass-card p-6 rounded-xl border border-border/80 space-y-3">
                <Award className="w-8 h-8 text-violet-400" />
                <h4 className="font-display font-semibold text-foreground">Verified Certificates</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Database-verifiable PDF certificates issued upon passing capstone projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-24 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue/10 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Ready to build AI software that works in production?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Start learning immediately with our free preview lessons, or explore custom AI solutions
              built by IF/ELSE Intelligence for enterprises worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/catalog">
                <Button variant="electric" size="lg">
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <a
                href="https://www.ifelseintelligence.com/contact?form=project#contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <span>Hire IF/ELSE for Custom AI</span>
                  <ExternalLink className="w-4 h-4 ml-1 text-brand-blue" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

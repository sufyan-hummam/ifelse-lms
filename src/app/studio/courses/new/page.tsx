import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { Role } from "@generated/prisma/client";
import { createCourseAction } from "@/features/instructor/actions";
import { ArrowLeft, Plus } from "lucide-react";

export const metadata = {
  title: "Create Course | IF/ELSE Intelligence LMS",
};

export default async function NewCoursePage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.INSTRUCTOR && user.role !== Role.ADMIN)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Studio</span>
        </Link>

        <Card glass className="border-border/80">
          <CardHeader>
            <CardTitle className="text-2xl font-bold font-display">
              Author New AI Engineering Course
            </CardTitle>
            <CardDescription>
              Define your curriculum parameters, level, category, and cover imagery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createCourseAction} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-foreground">
                  COURSE TITLE
                </label>
                <Input
                  name="title"
                  placeholder="e.g. Distributed LLM Fine-Tuning with LoRA & Axolotl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-foreground">
                  URL SLUG (UNIQUE)
                </label>
                <Input
                  name="slug"
                  placeholder="e.g. distributed-llm-fine-tuning"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    DOMAIN CATEGORY
                  </label>
                  <Input
                    name="category"
                    placeholder="e.g. LLM Systems, Vision, RAG"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    DIFFICULTY LEVEL
                  </label>
                  <select
                    name="level"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs font-mono text-foreground"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-foreground">
                  SHORT SYNOPSIS (MAX 150 CHARS)
                </label>
                <Input
                  name="shortDescription"
                  placeholder="High-level engineering summary for catalog cards..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-foreground">
                  FULL COURSE DESCRIPTION
                </label>
                <Textarea
                  name="description"
                  placeholder="Detailed architectural scope, prerequisites, and learning outcomes..."
                  className="h-28"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    ESTIMATED DURATION (MINUTES)
                  </label>
                  <Input
                    type="number"
                    name="durationMinutes"
                    defaultValue={360}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-semibold text-foreground">
                    COVER IMAGE URL
                  </label>
                  <Input
                    type="url"
                    name="coverImage"
                    defaultValue="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="published"
                  id="published"
                  defaultChecked
                  className="rounded"
                />
                <label htmlFor="published" className="text-xs font-mono text-foreground">
                  Publish to Course Catalog Immediately
                </label>
              </div>

              <Button type="submit" variant="electric" size="lg" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                <span>Initialize Course & Launch Studio</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

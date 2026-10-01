"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { submitAssignmentAction } from "@/features/assignments/actions";
import { CheckCircle2, Send } from "lucide-react";

interface AssignmentSubmitterProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    instructions: string;
    rubric?: string | null;
  };
  submission?: {
    id: string;
    content: string;
    status: string;
    grade?: number | null;
    feedback?: string | null;
  } | null;
}

export function AssignmentSubmitter({
  assignment,
  submission,
}: AssignmentSubmitterProps) {
  const [content, setContent] = React.useState(submission?.content || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setMessage(null);
    try {
      await submitAssignmentAction(assignment.id, content);
      setMessage("Assignment submitted successfully. Instructor review pending.");
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-border/80 p-6 md:p-8 space-y-6 my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="electric">CAPSTONE ASSIGNMENT</Badge>
            {submission && (
              <Badge
                variant={
                  submission.status === "GRADED"
                    ? "emerald"
                    : submission.status === "REJECTED"
                    ? "rose"
                    : "amber"
                }
              >
                {submission.status}
              </Badge>
            )}
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {assignment.title}
          </h2>
        </div>

        {submission?.grade !== null && submission?.grade !== undefined && (
          <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-center shrink-0">
            <div className="text-xl font-bold">{submission.grade}/100</div>
            <div className="text-[10px] uppercase font-semibold">Official Grade</div>
          </div>
        )}
      </div>

      <div className="space-y-4 text-sm text-foreground/90">
        <div>
          <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-blue mb-1">
            PROJECT OVERVIEW
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {assignment.description}
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-blue mb-1">
            INSTRUCTIONS
          </h4>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans bg-secondary/30 p-3 rounded-lg border border-border/60">
            {assignment.instructions}
          </pre>
        </div>

        {assignment.rubric && (
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-blue mb-1">
              EVALUATION RUBRIC
            </h4>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-secondary/30 p-3 rounded-lg border border-border/60">
              {assignment.rubric}
            </pre>
          </div>
        )}
      </div>

      {submission?.feedback && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>INSTRUCTOR FEEDBACK & REVIEW</span>
          </div>
          <p className="text-xs text-foreground/90 italic leading-relaxed">
            &ldquo;{submission.feedback}&rdquo;
          </p>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border/60">
        <label className="block text-xs font-mono text-foreground font-semibold">
          YOUR SUBMISSION (GITHUB REPOSITORY URL & ARCHITECTURE SUMMARY)
        </label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="https://github.com/username/project&#10;&#10;Architecture Summary: Describe your vector indexing strategy, reranker choice, and Ragas evaluation results..."
          className="h-32 text-xs font-mono"
          required
        />

        <div className="flex items-center justify-between">
          <Button type="submit" variant="electric" disabled={isSubmitting}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>{isSubmitting ? "Submitting..." : "Submit Project For Grading"}</span>
          </Button>

          {message && (
            <span className="text-xs font-mono text-emerald-400">{message}</span>
          )}
        </div>
      </form>
    </div>
  );
}

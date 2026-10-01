"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { submitQuizAttemptAction } from "@/features/quiz/actions";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface Option {
  id: string;
  optionText: string;
  isCorrect: boolean;
  explanation?: string | null;
}

interface Question {
  id: string;
  questionText: string;
  explanation?: string | null;
  options: Option[];
}

interface QuizRunnerProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    questions: Question[];
  };
}

export function QuizRunner({ quiz }: QuizRunnerProps) {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({});
  const [result, setResult] = React.useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (result) return; // locked after submission
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < quiz.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuizAttemptAction(quiz.id, selectedAnswers);
      setResult(res);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to submit quiz attempt");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResult(null);
  };

  return (
    <div className="glass-card rounded-2xl border border-border/80 p-6 md:p-8 space-y-8 my-8">
      {/* Quiz Header */}
      <div className="border-b border-border/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="logic">EVALUATION QUIZ</Badge>
            <span className="font-mono text-xs text-muted-foreground">
              Pass Threshold: {quiz.passingScore}%
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">{quiz.title}</h2>
          {quiz.description && (
            <p className="text-xs sm:text-sm text-muted-foreground">{quiz.description}</p>
          )}
        </div>

        {result && (
          <div
            className={`p-4 rounded-xl border font-mono text-center shrink-0 ${
              result.passed
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            <div className="text-2xl font-bold">{result.score}%</div>
            <div className="text-[10px] uppercase font-semibold">
              {result.passed ? "✔ PASSED // VERIFIED" : "FAILED // RETRY NEEDED"}
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {quiz.questions.map((q, qIdx) => {
          const selectedOptionId = selectedAnswers[q.id];

          return (
            <div key={q.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-blue/20 border border-brand-blue/30 text-brand-sky font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                  {q.questionText}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5 pl-9">
                {q.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optStyle =
                    "border-border/80 bg-secondary/30 hover:border-brand-blue/60 hover:bg-secondary/60 text-foreground";

                  if (result) {
                    if (opt.isCorrect) {
                      optStyle = "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-medium";
                    } else if (isSelected && !opt.isCorrect) {
                      optStyle = "border-destructive/60 bg-destructive/15 text-rose-300";
                    } else {
                      optStyle = "opacity-50 border-border/40 bg-secondary/20";
                    }
                  } else if (isSelected) {
                    optStyle = "border-brand-blue bg-brand-blue/15 text-foreground ring-1 ring-brand-blue";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`flex items-center justify-between p-3.5 rounded-lg border text-left text-xs sm:text-sm transition-all cursor-pointer ${optStyle}`}
                    >
                      <span>{opt.optionText}</span>
                      {result && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {result && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after quiz submission */}
              {result && q.explanation && (
                <div className="ml-9 p-3 rounded-lg border border-brand-blue/20 bg-brand-blue/5 text-xs text-muted-foreground leading-relaxed">
                  <span className="font-mono text-brand-blue-light font-bold uppercase mr-1.5">
                    TECHNICAL RATIONALE:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Actions */}
      <div className="pt-6 border-t border-border/60 flex items-center justify-between">
        {!result ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant="electric"
            className="w-full sm:w-auto px-8"
          >
            {isSubmitting ? "Evaluating Results..." : "Submit Quiz Assessment"}
          </Button>
        ) : (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!result.passed && (
              <Button onClick={handleRetry} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                <span>Retry Quiz</span>
              </Button>
            )}
            <span className="font-mono text-xs text-muted-foreground">
              {result.passed
                ? "Score recorded in database. Lesson marked complete!"
                : "Pass score required to complete lesson."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

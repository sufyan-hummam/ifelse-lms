"use client";

import * as React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { registerAction } from "@/features/auth/actions";
import { AlertCircle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await registerAction(null, formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo size="lg" showTagline={true} />
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mt-2">
            REGISTRATION PROTOCOL: NEW STUDENT ENROLLMENT
          </p>
        </div>

        <Card glass className="border-border/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Create your LMS account</CardTitle>
            <CardDescription>
              Join engineers mastering applied AI, RAG, and autonomous agent systems.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-foreground/80 font-medium">
                  FULL NAME
                </label>
                <Input
                  name="name"
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-foreground/80 font-medium">
                  WORK OR ACADEMIC EMAIL
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="alex@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-foreground/80 font-medium">
                  PASSWORD
                </label>
                <Input
                  name="password"
                  type="password"
                  placeholder="Min 8 chars, uppercase, lowercase & number"
                  required
                  autoComplete="new-password"
                />
              </div>

              <ul className="text-xs text-muted-foreground space-y-1 font-mono pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Immediate access to free preview lessons & code playground</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official verifiable PDF certificate upon course completion</span>
                </li>
              </ul>

              <Button
                type="submit"
                variant="electric"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-brand-sky hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

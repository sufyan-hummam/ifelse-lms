"use client";

import * as React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { signInAction } from "@/features/auth/actions";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signInAction(null, formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo size="lg" showTagline={true} />
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mt-2">
            ACCESS PROTOCOL: AUTHENTICATION
          </p>
        </div>

        <Card glass className="border-border/80">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your courses, progress, and certificates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-foreground/80 font-medium">
                  EMAIL ADDRESS
                </label>
                <Input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-foreground/80 font-medium">
                    PASSWORD
                  </label>
                </div>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                variant="electric"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/register"
            className="text-brand-sky hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

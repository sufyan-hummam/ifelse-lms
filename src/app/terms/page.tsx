import * as React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Terms of Service | IF/ELSE Intelligence LMS",
  description: "Terms and conditions governing the IF/ELSE Intelligence learning management platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-8">
        <div className="space-y-3 border-b border-border/60 pb-6">
          <Badge variant="logic">LEGAL NOTICE // DRAFT</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="font-mono text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-lg p-3">
            ⚠️ NOTICE: This is sensible placeholder policy text marked [TO BE REVIEWED BY LEGAL].
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">1. Acceptance of Terms</h2>
            <p>
              By accessing and utilizing the IF/ELSE Intelligence LMS portal (&ldquo;Platform&rdquo;), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, you must discontinue your use of the platform immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">2. Course Materials & Intellectual Property</h2>
            <p>
              All curriculum content, proprietary RAG architecture diagrams, code playgrounds, benchmarks, and course videos
              remain the intellectual property of IF/ELSE Intelligence Pte. Ltd. You are granted a personal, non-exclusive,
              revocable license to view and practice the material for educational purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">3. Code Execution & Sandbox Security</h2>
            <p>
              Interactive code playgrounds run client-side in sandboxed browser workers or WebAssembly. You agree not to attempt
              denial-of-service, penetration testing without prior authorization, or reverse engineering of platform microservices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">4. Verifiable Certificates</h2>
            <p>
              Official completion certificates are issued based on verified database progression and passing scores on quizzes
              and assignments. IF/ELSE Intelligence reserves the right to revoke credentials obtained through fraudulent activity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">5. Limitation of Liability</h2>
            <p>
              All software models and architectures provided are for educational engineering reference. IF/ELSE Intelligence
              is not liable for deployment anomalies in third-party production systems.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

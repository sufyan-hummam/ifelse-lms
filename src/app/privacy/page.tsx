import * as React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Privacy Policy | IF/ELSE Intelligence LMS",
  description: "Privacy policy describing data processing practices at IF/ELSE Intelligence.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 w-full space-y-8">
        <div className="space-y-3 border-b border-border/60 pb-6">
          <Badge variant="logic">PRIVACY PROTOCOL // DRAFT</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="font-mono text-xs text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-lg p-3">
            ⚠️ NOTICE: This is sensible placeholder policy text marked [TO BE REVIEWED BY LEGAL].
          </p>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">1. Information We Collect</h2>
            <p>
              We collect information provided directly during registration (name, email address, password hash)
              and learning telemetry (lesson completion status, code editor interaction, quiz scores, and certificate records).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">2. How We Use Data</h2>
            <p>
              Your data is used strictly to provide personalized LMS features: tracking streaks, synchronizing course progress,
              enforcing learning path prerequisites, evaluating code exercises, and generating official completion credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">3. AI Processing & Third Parties</h2>
            <p>
              Queries sent to the AI Study Buddy are processed server-side. When Gemini API integration is active,
              the query and relevant course chunks are transmitted securely over TLS to Google Cloud. No student personal identification
              is provided to the model.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">4. Cookies & Authentication</h2>
            <p>
              We use strictly necessary HTTP-only, SameSite=Lax signed session cookies to preserve your authentication state.
              We do not utilize cross-site tracking cookies or sell your personal information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground font-display">5. Contact Information</h2>
            <p>
              For data access requests or privacy inquiries, contact our data protection team at{" "}
              <a href="mailto:privacy@ifelseintelligence.com" className="text-brand-sky underline">
                privacy@ifelseintelligence.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

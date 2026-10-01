import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BrandLogo } from "@/components/brand-logo";
import { CertificateDownloadButton } from "@/components/certificate-download-button";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, ArrowLeft } from "lucide-react";

interface CertificatePageProps {
  params: Promise<{ certificateNumber: string }>;
}

export async function generateMetadata({ params }: CertificatePageProps) {
  const { certificateNumber } = await params;
  return {
    title: `Verified Certificate ${certificateNumber} | IF/ELSE Intelligence`,
    description: `Official verification record for certificate ${certificateNumber}`,
  };
}

export default async function CertificateVerificationPage({
  params,
}: CertificatePageProps) {
  const { certificateNumber } = await params;

  const certificate = await db.certificate.findUnique({
    where: { certificateNumber },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        include: {
          instructor: {
            select: { name: true, headline: true },
          },
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <CertificateDownloadButton />
        </div>

        {/* The Verified Certificate Frame */}
        <div className="rounded-3xl border-2 border-brand-blue/30 bg-gradient-to-b from-card via-brand-surface to-card p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center space-y-8 glass-card">
          {/* Subtle security rosette pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at center, currentColor 2px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />

          {/* Certificate Header */}
          <div className="flex flex-col items-center space-y-3 relative z-10">
            <BrandLogo size="lg" showTagline={false} />
            <div className="pt-2">
              <span className="font-mono text-xs text-brand-sky font-bold uppercase tracking-widest">
                IF/ELSE INTELLIGENCE ACADEMY
              </span>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                CERTIFICATE OF ENGINEERING MASTERY
              </p>
            </div>
          </div>

          {/* Recipient */}
          <div className="space-y-2 relative z-10">
            <p className="text-xs font-mono text-muted-foreground uppercase">
              THIS CREDENTIAL IS PROUDLY CONFERRED UPON
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-foreground underline decoration-brand-blue decoration-2 underline-offset-8">
              {certificate.user.name || certificate.user.email}
            </h1>
          </div>

          {/* Course & Completion Statement */}
          <div className="max-w-xl mx-auto space-y-3 relative z-10">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              for successfully completing all curriculum requirements, interactive code playgrounds,
              rigorous evaluation benchmarks, and the capstone engineering project in:
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-brand-sky">
              {certificate.course.title}
            </h2>
            <p className="font-mono text-xs text-muted-foreground">
              Level: {certificate.course.level} • Category: {certificate.course.category}
            </p>
          </div>

          {/* Verification Badge & Signatures */}
          <div className="pt-8 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center relative z-10">
            <div className="space-y-1">
              <p className="font-display font-semibold text-sm text-foreground">
                {certificate.course.instructor.name}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">Course Instructor</p>
            </div>

            {/* Official Seal */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-16 h-16 rounded-full bg-brand-blue/15 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                VERIFIED AUTHENTIC
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-display font-semibold text-sm text-foreground">
                Dr. Sarah Chen
              </p>
              <p className="font-mono text-[10px] text-muted-foreground">
                Head of AI Research & LMS
              </p>
            </div>
          </div>

          {/* Telemetry Security Hash Bar */}
          <div className="pt-6 border-t border-border/40 font-mono text-[11px] text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2 relative z-10">
            <div>
              <span>ID: </span>
              <span className="text-foreground font-bold">{certificate.certificateNumber}</span>
            </div>
            <div>
              <span>ISSUED: </span>
              <span className="text-foreground">{formatDate(certificate.issueDate)}</span>
            </div>
            <div className="truncate max-w-[240px]">
              <span>VERIFY KEY: </span>
              <span className="text-brand-blue">{certificate.verificationHash.slice(0, 16)}...</span>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

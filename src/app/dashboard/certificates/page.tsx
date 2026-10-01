import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Award, ExternalLink, ShieldCheck, Calendar, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "My Certificates | IF/ELSE Intelligence LMS",
  description: "View and verify your earned AI engineering certificates.",
};

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin?callbackUrl=/dashboard/certificates");

  const certificates = await db.certificate.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
        },
      },
    },
    orderBy: { issueDate: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
            <span>VERIFIED ACADEMIC CREDENTIALS</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            My Certificates
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Official verifiable certificates issued by IF/ELSE Intelligence upon
            100% curriculum completion and capstone evaluation.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl border border-border/80 max-w-md mx-auto space-y-4">
            <Award className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="font-display text-lg font-bold">No Certificates Yet</h3>
            <p className="text-xs text-muted-foreground">
              Complete any course curriculum and capstone project to generate your official
              cryptographically verifiable certificate.
            </p>
            <Link href="/catalog">
              <Button variant="electric" size="sm">
                Explore Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass-card rounded-2xl border border-border/80 p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="emerald">VERIFIED CREDENTIAL</Badge>
                    <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(cert.issueDate)}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] text-brand-blue-light font-bold">
                      {cert.certificateNumber}
                    </span>
                    <h3 className="font-display text-xl font-bold text-foreground mt-1">
                      {cert.course.title}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground mt-1">
                      Instructor: {cert.course.instructor.name}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-border/60 bg-secondary/30 font-mono text-[10px] text-muted-foreground break-all">
                    <span className="text-brand-blue font-bold">HASH: </span>
                    {cert.verificationHash}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Validated Protocol</span>
                  </span>

                  <Link href={`/certificates/${cert.certificateNumber}`}>
                    <Button variant="electric" size="sm" className="font-mono text-xs">
                      <span>View Credential</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

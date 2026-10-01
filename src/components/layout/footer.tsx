import * as React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background/95 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              IF/ELSE Intelligence designs and builds applied AI engineering systems,
              RAG architectures, computer vision, and autonomous agents. The LMS portal
              trains engineers from fundamental binary logic to frontier production AI.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-secondary/30 font-mono text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LOGIC PROTOCOL: ACTIVE // BEYOND BINARIES</span>
            </div>
          </div>

          {/* Learning Programs */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Curriculum
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/catalog?category=rag"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GenAI & RAG Systems
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=vision"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Computer Vision & ML
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?category=agents"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Autonomous AI Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/paths"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Applied AI Career Paths
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Resources */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://www.ifelseintelligence.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Main Website</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-blue" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ifelseintelligence.com/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>AI Products</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-blue" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ifelseintelligence.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>About IF/ELSE</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-brand-blue" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@ifelseintelligence.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@ifelseintelligence.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} IF/ELSE Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <a
              href="https://www.ifelseintelligence.com/contact?form=project#contact"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

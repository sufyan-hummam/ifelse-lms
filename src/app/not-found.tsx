import * as React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center justify-center space-y-6">
        <div className="font-mono text-xs text-brand-blue uppercase tracking-widest font-semibold">
          ERROR 404 // ROUTE NOT FOUND
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Branch Condition Undefined
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The requested lesson, course, or resource node could not be located in the curriculum graph.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/catalog">
            <Button variant="electric" size="sm" className="font-mono text-xs">
              <Compass className="w-3.5 h-3.5 mr-1.5" />
              <span>Course Catalog</span>
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import * as React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { UserNav } from "@/components/layout/user-nav";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 glass-panel">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <BrandLogo size="md" showTagline={false} />

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/catalog"
              className="text-foreground/80 hover:text-foreground transition-colors hover:underline decoration-brand-blue underline-offset-8"
            >
              Courses
            </Link>
            <Link
              href="/paths"
              className="text-foreground/80 hover:text-foreground transition-colors hover:underline decoration-brand-blue underline-offset-8"
            >
              Learning Paths
            </Link>
            <Link
              href="/dashboard"
              className="text-foreground/80 hover:text-foreground transition-colors hover:underline decoration-brand-blue underline-offset-8"
            >
              Dashboard
            </Link>
            {user?.role === "INSTRUCTOR" && (
              <Link
                href="/studio"
                className="text-emerald-400 hover:text-emerald-300 font-mono text-xs"
              >
                [STUDIO]
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-amber-400 hover:text-amber-300 font-mono text-xs"
              >
                [ADMIN]
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Search Button (Ctrl+K trigger) */}
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border/80 bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
            aria-label="Search or trigger command palette"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="font-mono text-[10px] bg-background/80 px-1.5 py-0.5 rounded border border-border">
              Ctrl+K
            </kbd>
          </button>

          {/* Link back to Main IF/ELSE Site */}
          <a
            href="https://www.ifelseintelligence.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-secondary/40"
          >
            <span>ifelseintelligence.com</span>
            <ExternalLink className="w-3 h-3 text-brand-sky" />
          </a>

          <ThemeToggle />

          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="electric" size="sm">
                  Explore Courses
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

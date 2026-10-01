"use client";

import * as React from "react";
import Link from "next/link";
import { type SessionUser } from "@/lib/auth";
import { signOutAction } from "@/features/auth/actions";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  LayoutDashboard,
  Shield,
  Palette,
  Award,
  ChevronDown,
} from "lucide-react";

interface UserNavProps {
  user: SessionUser;
}

export function UserNav({ user }: UserNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleBadgeVariant = {
    ADMIN: "amber",
    INSTRUCTOR: "emerald",
    STUDENT: "logic",
  }[user.role] as "amber" | "emerald" | "logic";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-full hover:bg-secondary/60 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-xs font-mono font-bold text-brand-sky">
          {user.name ? user.name.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase()}
        </div>
        <div className="hidden md:flex flex-col items-start text-left leading-tight">
          <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
            {user.name || user.email}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">{user.role}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl glass-card py-2 z-50 animate-in fade-in-0 zoom-in-95">
          <div className="px-4 py-2 border-b border-border/60">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            <div className="mt-1.5">
              <Badge variant={roleBadgeVariant} className="text-[10px] py-0 px-1.5">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground/90 hover:bg-secondary hover:text-foreground"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-brand-blue" />
              <span>Student Dashboard</span>
            </Link>

            {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
              <Link
                href="/studio"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground/90 hover:bg-secondary hover:text-foreground"
              >
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instructor Studio</span>
              </Link>
            )}

            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground/90 hover:bg-secondary hover:text-foreground"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Console</span>
              </Link>
            )}

            <Link
              href="/dashboard/certificates"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground/90 hover:bg-secondary hover:text-foreground"
            >
              <Award className="w-3.5 h-3.5 text-violet-400" />
              <span>My Certificates</span>
            </Link>
          </div>

          <div className="border-t border-border/60 pt-1">
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

interface LogicBadgeProps {
  condition?: string;
  thenClause: string;
  elseClause?: string;
  state?: "unlocked" | "locked" | "active" | "neutral";
  className?: string;
}

export function LogicBadge({
  condition,
  thenClause,
  elseClause,
  state = "neutral",
  className,
}: LogicBadgeProps) {
  const stateColor = {
    unlocked: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    locked: "text-slate-400 border-slate-700/50 bg-slate-800/30",
    active: "text-brand-sky border-brand-blue/30 bg-brand-blue/10",
    neutral: "text-slate-300 border-border bg-secondary/50",
  }[state];

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors",
        stateColor,
        className
      )}
    >
      {condition && (
        <>
          <span className="font-bold text-brand-sky">IF</span>
          <span className="text-foreground/90">{condition}</span>
        </>
      )}
      <span className="font-bold text-brand-blue">THEN</span>
      <span className="font-medium">{thenClause}</span>
      {elseClause && (
        <>
          <span className="font-bold text-amber-400">ELSE</span>
          <span className="text-muted-foreground">{elseClause}</span>
        </>
      )}
    </div>
  );
}

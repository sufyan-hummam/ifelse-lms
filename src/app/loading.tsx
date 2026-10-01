import * as React from "react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-blue/20 border-t-brand-blue animate-spin" />
        <span className="absolute font-mono text-[9px] text-brand-sky font-bold">
          IF
        </span>
      </div>
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest animate-pulse">
        CALCULATING // LOADING LAB STATE...
      </p>
    </div>
  );
}

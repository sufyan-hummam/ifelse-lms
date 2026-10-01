"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg border border-border/40 bg-secondary/50" />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-border/40 bg-secondary/50 hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
      title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0" />
      )}
    </button>
  );
}

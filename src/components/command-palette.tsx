"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Compass,
  LayoutDashboard,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const items = [
    {
      category: "Navigation",
      items: [
        {
          id: "nav-catalog",
          label: "Browse Course Catalog",
          icon: BookOpen,
          action: () => router.push("/catalog"),
        },
        {
          id: "nav-paths",
          label: "Explore Learning Paths",
          icon: Compass,
          action: () => router.push("/paths"),
        },
        {
          id: "nav-dash",
          label: "Student Dashboard",
          icon: LayoutDashboard,
          action: () => router.push("/dashboard"),
        },
      ],
    },
    {
      category: "Preferences",
      items: [
        {
          id: "theme-toggle",
          label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
          icon: theme === "dark" ? Sun : Moon,
          action: () => setTheme(theme === "dark" ? "light" : "dark"),
        },
      ],
    },
  ];

  const filtered = items
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((group) => group.items.length > 0);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-background/80 backdrop-blur-md animate-in fade-in-0"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-border/80">
          <Search className="w-4 h-4 text-muted-foreground mr-3" />
          <input
            type="text"
            placeholder="Type a command or search courses... (ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-muted-foreground hover:text-foreground"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching commands or courses found.
            </div>
          ) : (
            filtered.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground/90 hover:bg-secondary/80 hover:text-foreground transition-colors cursor-pointer text-left"
                    >
                      <Icon className="w-4 h-4 text-brand-blue" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-border/60 bg-secondary/30 text-[11px] text-muted-foreground font-mono">
          <span>Navigate with arrows</span>
          <span>IF / ELSE Intelligence</span>
        </div>
      </div>
    </div>
  );
}

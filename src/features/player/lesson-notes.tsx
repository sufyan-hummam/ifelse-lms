"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import {
  updateLessonNotesAction,
  toggleLessonBookmarkAction,
} from "@/features/progress/actions";
import { Bookmark, FileText, Check, Save } from "lucide-react";

interface LessonNotesProps {
  lessonId: string;
  initialNotes?: string | null;
  initialBookmarked?: boolean;
}

export function LessonNotes({
  lessonId,
  initialNotes = "",
  initialBookmarked = false,
}: LessonNotesProps) {
  const [notes, setNotes] = React.useState(initialNotes || "");
  const [isBookmarked, setIsBookmarked] = React.useState(initialBookmarked);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    try {
      await toggleLessonBookmarkAction(lessonId);
    } catch {
      setIsBookmarked(isBookmarked);
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await updateLessonNotesAction(lessonId, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggleBookmark}
        className={`p-2 rounded-lg border transition-colors cursor-pointer ${
          isBookmarked
            ? "border-brand-blue/50 bg-brand-blue/15 text-brand-blue-light"
            : "border-border/80 bg-secondary/40 text-muted-foreground hover:text-foreground"
        }`}
        title={isBookmarked ? "Remove Bookmark" : "Bookmark Lesson"}
      >
        <Bookmark
          className={`w-4 h-4 ${isBookmarked ? "fill-brand-blue-light" : ""}`}
        />
      </button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 gap-1.5 text-xs font-mono"
      >
        <FileText className="w-3.5 h-3.5 text-brand-blue" />
        <span>Notes</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-card border-l border-border shadow-2xl glass-card p-6 z-50 flex flex-col justify-between animate-in slide-in-from-right-full">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" />
                <h3 className="font-display font-bold text-foreground text-sm">
                  Personal Lesson Notes
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              These notes are private and persisted across your account.
            </p>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down formulas, ideas, architecture thoughts..."
              className="h-96 text-xs font-mono leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <Button
              onClick={handleSaveNotes}
              disabled={isSaving}
              variant="electric"
              size="sm"
              className="w-full text-xs font-mono"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1" />
                  <span>{isSaving ? "Saving..." : "Save Notes"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

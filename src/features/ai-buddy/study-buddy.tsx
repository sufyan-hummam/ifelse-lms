"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Sparkles, Send, X, BookOpen, Loader2 } from "lucide-react";

interface StudyBuddyProps {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citation?: string;
}

export function StudyBuddy({
  courseId,
  courseTitle,
  lessonId,
}: StudyBuddyProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am your AI Study Buddy for "${courseTitle}". I answer strictly from this course's verified lessons and architectural guidelines. What would you like to explore?`,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/study-buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          question: q,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Study buddy failed to respond");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          citation: data.citation,
        },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${(err as Error).message}. Please verify Gemini API key configuration.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    "Explain the formula for RRF and why k=60",
    "How does contextual chunking avoid semantic isolation?",
    "What is the difference between bi-encoders and cross-encoders?",
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="electric"
        size="sm"
        className="fixed bottom-6 right-6 z-40 shadow-2xl h-11 px-4 gap-2 font-mono text-xs rounded-full border border-white/20"
      >
        <Bot className="w-4 h-4 text-white" />
        <span className="hidden sm:inline">AI Study Buddy</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-card border border-border shadow-2xl glass-card rounded-2xl z-50 flex flex-col overflow-hidden animate-in fade-in-0 slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b border-border/60 bg-secondary/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-sky">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-foreground">
                  AI Study Buddy
                </h4>
                <p className="font-mono text-[9px] text-emerald-400">
                  GROUNDED TO: {courseTitle.slice(0, 24)}...
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                    m.role === "user"
                      ? "bg-brand-blue text-white rounded-br-none"
                      : "bg-secondary/70 text-foreground border border-border/60 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.citation && (
                    <div className="mt-2 pt-1.5 border-t border-white/10 font-mono text-[10px] text-brand-sky flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{m.citation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
                <span>Grounding answer in course lessons...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-1.5 border-t border-border/40 bg-secondary/20 flex flex-wrap gap-1.5">
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="text-[10px] font-mono text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary px-2 py-0.5 rounded border border-border/60 text-left truncate max-w-full cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border/60 bg-secondary/30 flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this lesson..."
              className="h-9 text-xs"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="electric"
              size="sm"
              className="h-9 px-3 shrink-0"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Runtime exception captured:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-12 h-12 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-2 max-w-md">
        <span className="font-mono text-xs text-destructive uppercase tracking-widest font-semibold">
          SYSTEM FAULT // EXCEPTION CAPTURED
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Computation Interrupted
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          An unhandled error occurred in this execution branch. You can attempt to retry the state transition.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        variant="electric"
        size="sm"
        className="font-mono text-xs"
      >
        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
        <span>Retry State Execution</span>
      </Button>
    </div>
  );
}

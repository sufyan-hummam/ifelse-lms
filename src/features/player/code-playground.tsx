"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Terminal, Copy, Check, Loader2, Sparkles } from "lucide-react";

interface CodePlaygroundProps {
  initialCode: string;
  language?: string;
  lessonTitle?: string;
}

interface PyodideInstance {
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
}

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInstance>;
    pyodideInstance?: PyodideInstance;
  }
}

export function CodePlayground({
  initialCode,
  language = "python",
}: CodePlaygroundProps) {
  const [code, setCode] = React.useState(initialCode);
  const [output, setOutput] = React.useState<string | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [runtimeStatus, setRuntimeStatus] = React.useState<string | null>(null);

  const isPython = language.toLowerCase() === "python" || code.includes("def ") || code.includes("import ");

  const runJavaScriptInWorker = (codeToRun: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const workerScript = `
        self.onmessage = function(e) {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
            info: (...args) => logs.push('[INFO] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
            warn: (...args) => logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
            error: (...args) => logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
          };

          try {
            // Strip typescript type annotations if basic
            let executable = e.data.code;
            const runFn = new Function('console', executable);
            const result = runFn(customConsole);
            if (result !== undefined) {
              logs.push('=> ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
            }
            self.postMessage({ success: true, logs: logs.join('\\n') });
          } catch (err) {
            self.postMessage({ success: false, error: err.stack || err.message });
          }
        };
      `;

      const blob = new Blob([workerScript], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      const worker = new Worker(workerUrl);

      const timeout = setTimeout(() => {
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        reject(new Error("Execution timed out (5s limit exceeded)."));
      }, 5000);

      worker.onmessage = (event) => {
        clearTimeout(timeout);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        if (event.data.success) {
          resolve(event.data.logs || "(No console output returned)");
        } else {
          reject(new Error(event.data.error));
        }
      };

      worker.onerror = (err) => {
        clearTimeout(timeout);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        reject(new Error(err.message));
      };

      worker.postMessage({ code: codeToRun });
    });
  };

  const runPythonInPyodide = async (codeToRun: string): Promise<string> => {
    // Check if pyodide script is already loaded
    if (!window.pyodideInstance) {
      setRuntimeStatus("Loading Pyodide WASM runtime...");
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.getElementById("pyodide-cdn-script");
          if (existingScript) {
            existingScript.addEventListener("load", () => resolve());
            existingScript.addEventListener("error", () => reject(new Error("Failed to load Pyodide from CDN")));
            return;
          }
          const script = document.createElement("script");
          script.id = "pyodide-cdn-script";
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Pyodide WebAssembly runtime from CDN. Check your internet connection."));
          document.head.appendChild(script);
        });
      }

      setRuntimeStatus("Initializing Python 3.12 WebAssembly environment...");
      if (window.loadPyodide) {
        window.pyodideInstance = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
      }
    }

    setRuntimeStatus("Running Python code...");
    const pyodide = window.pyodideInstance;
    if (!pyodide) {
      throw new Error("Pyodide WebAssembly runtime could not be loaded. Please check your internet connection.");
    }
    const stdoutLogs: string[] = [];

    pyodide.setStdout({
      batched: (msg: string) => stdoutLogs.push(msg),
    });
    pyodide.setStderr({
      batched: (msg: string) => stdoutLogs.push("[STDERR] " + msg),
    });

    try {
      const result = await pyodide.runPythonAsync(codeToRun);
      if (result !== undefined && result !== null) {
        stdoutLogs.push(`=> ${result.toString()}`);
      }
      return stdoutLogs.length > 0 ? stdoutLogs.join("\n") : "(Code executed successfully with no output)";
    } catch (err: unknown) {
      throw new Error((err as Error).message || String(err));
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    setRuntimeStatus("Preparing sandbox environment...");

    const startTime = performance.now();

    try {
      let result = "";
      if (isPython) {
        result = await runPythonInPyodide(code);
      } else {
        result = await runJavaScriptInWorker(code);
      }
      const durationMs = Math.round(performance.now() - startTime);
      setOutput(`${result}\n\n[Process completed in ${durationMs}ms]`);
    } catch (err: unknown) {
      setOutput(`[RUNTIME ERROR]: ${(err as Error).message || String(err)}`);
    } finally {
      setIsRunning(false);
      setRuntimeStatus(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput(null);
  };

  return (
    <div className="rounded-xl border border-border/80 overflow-hidden glass-card my-6">
      {/* Playground Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/40 border-b border-border/80 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-foreground uppercase tracking-wider">
            SANDBOXED CODE PLAYGROUND
          </span>
          <span className="text-[10px] text-brand-sky uppercase px-1.5 py-0.5 rounded bg-brand-blue/15 border border-brand-blue/30 font-bold">
            {isPython ? "Python (Pyodide WASM)" : "JavaScript (Web Worker)"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <Button
            onClick={handleRun}
            disabled={isRunning}
            variant="electric"
            size="sm"
            className="h-8 text-xs font-mono"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run in Browser</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="p-4 bg-[#080b12] text-foreground font-mono text-xs leading-relaxed">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
          spellCheck={false}
          className="w-full bg-transparent resize-y outline-none font-mono text-xs leading-relaxed text-[#E8EDF7] selection:bg-brand-blue/40 border-0 focus:ring-0 p-0"
        />
      </div>

      {/* Sandbox Info / Status Bar */}
      {runtimeStatus && (
        <div className="px-4 py-2 bg-brand-blue/10 border-t border-brand-blue/20 text-brand-sky font-mono text-[11px] flex items-center gap-2 animate-pulse">
          <Sparkles className="w-3 h-3" />
          <span>{runtimeStatus}</span>
        </div>
      )}

      {/* Terminal Output */}
      {output && (
        <div className="border-t border-border/80 bg-[#06080e] p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/40 text-[10px] uppercase text-muted-foreground">
            <span>TERMINAL OUTPUT (REAL RUNTIME EXECUTION)</span>
            <button
              onClick={() => setOutput(null)}
              className="hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-60">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

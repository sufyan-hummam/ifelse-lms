"use client";

import * as React from "react";
import { CheckCircle2, Lock, Sparkles, Cpu } from "lucide-react";

export interface SkillNode {
  id: string;
  name: string;
  category: "Foundations" | "Retrieval" | "Agents" | "Vision" | "Production";
  status: "completed" | "in-progress" | "locked";
  dependsOn?: string[];
}

interface SkillGraphProps {
  nodes?: SkillNode[];
}

export function SkillGraph({ nodes: customNodes }: SkillGraphProps) {
  const defaultNodes: SkillNode[] = [
    {
      id: "node-1",
      name: "Vector Embeddings & Geometries",
      category: "Foundations",
      status: "completed",
    },
    {
      id: "node-2",
      name: "Contextual Chunking",
      category: "Retrieval",
      status: "completed",
      dependsOn: ["node-1"],
    },
    {
      id: "node-3",
      name: "Hybrid BM25 + Dense RRF",
      category: "Retrieval",
      status: "in-progress",
      dependsOn: ["node-2"],
    },
    {
      id: "node-4",
      name: "Deterministic Agent State Loops",
      category: "Agents",
      status: "completed",
    },
    {
      id: "node-5",
      name: "Tool Validation with Zod",
      category: "Agents",
      status: "completed",
      dependsOn: ["node-4"],
    },
    {
      id: "node-6",
      name: "Ragas Quantitative Evaluation",
      category: "Production",
      status: "locked",
      dependsOn: ["node-3", "node-5"],
    },
  ];

  const nodes = customNodes && customNodes.length > 0 ? customNodes : defaultNodes;

  return (
    <div className="glass-card rounded-2xl border border-border/80 p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-brand-blue" />
            <span className="font-mono text-xs text-brand-blue uppercase tracking-wider font-semibold">
              DYNAMIC SKILL GRAPH // DEPENDENCY MAP
            </span>
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Neural Systems Competency Map
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Mastered
          </span>
          <span className="flex items-center gap-1.5 text-brand-blue-light">
            <span className="w-2 h-2 rounded-full bg-brand-blue-light animate-pulse" />
            Active
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            Locked
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {nodes.map((node) => {
          const statusStyle = {
            completed: "border-emerald-500/40 bg-emerald-500/10 text-foreground",
            "in-progress": "border-brand-blue/50 bg-brand-blue/15 text-foreground ring-1 ring-brand-blue/40",
            locked: "border-border/40 bg-secondary/20 text-muted-foreground opacity-60",
          }[node.status];

          return (
            <div
              key={node.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${statusStyle}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-muted-foreground">
                  {node.category}
                </span>
                {node.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : node.status === "in-progress" ? (
                  <Sparkles className="w-4 h-4 text-brand-blue-light animate-pulse" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold">{node.name}</h4>
                {node.dependsOn && (
                  <p className="font-mono text-[9px] text-muted-foreground mt-1">
                    Prereqs: {node.dependsOn.join(", ")}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono">
                <span className="uppercase font-bold">
                  {node.status === "completed"
                    ? "UNLOCKED"
                    : node.status === "in-progress"
                    ? "IN PROGRESS"
                    : "LOCKED"}
                </span>
                <span>IF/ELSE LOGIC</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

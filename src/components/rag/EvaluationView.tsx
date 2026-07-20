"use client";

/**
 * EvaluationView — placeholder RAG evaluation dashboard (UI scaffolding).
 *
 * Compares two embedding models side by side. Everything here is INERT —
 * the dropdowns are dummy and every metric shows a placeholder. Wiring it to
 * the CAIPE query pipeline (/v1/query, metric computation) is a follow-up.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Play } from "lucide-react";
import { useState } from "react";

const PLACEHOLDER = "—";

const EMBEDDING_OPTIONS = [
  "nomic-embed-text",
  "mxbai-embed-large",
  "all-minilm",
  "snowflake-arctic-embed",
  "bge-m3",
];

const METRIC_ROWS = [
  "Contextual Precision",
  "Contextual Recall",
  "Contextual Relevancy",
  "Answer Relevancy",
  "Faithfulness",
  "MRR",
  "nDCG@k",
  "P50 latency",
  "P95 latency",
  "Avg tokens",
];

export default function EvaluationView() {
  const [embeddingA, setEmbeddingA] = useState("nomic-embed-text");
  const [embeddingB, setEmbeddingB] = useState("mxbai-embed-large");

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border shrink-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom right, color-mix(in srgb, var(--gradient-from) 15%, transparent) 0%, color-mix(in srgb, var(--gradient-to) 8%, transparent) 50%, transparent 100%)`,
          }}
        />
        <div className="relative px-6 py-3 flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary-br shadow-md shadow-primary/20">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">Evaluation</h1>
            <p className="text-muted-foreground text-xs">
              Compare embedding models ((Wiring in process))
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Config panel */}
        <aside className="w-72 shrink-0 border-r border-border bg-card/40 p-5 space-y-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-foreground">Configuration</h2>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Embedding A</label>
            <select
              value={embeddingA}
              onChange={(e) => setEmbeddingA(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {EMBEDDING_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Embedding B</label>
            <select
              value={embeddingB}
              onChange={(e) => setEmbeddingB(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {EMBEDDING_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Questions path</label>
            <Input placeholder="hotpotqa_deepeval_goldens.jsonl" disabled />
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input type="checkbox" disabled className="mt-0.5 h-4 w-4 rounded border-border" />
            <span>Retrieval only (skip generation metrics)</span>
          </label>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Top-K</label>
            <Input type="number" defaultValue={3} disabled />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Limit per category</label>
            <Input type="number" defaultValue={1} disabled />
          </div>

          <Button className="w-full" disabled>
            <Play className="h-4 w-4 mr-1" />
            Run Comparison
          </Button>

          <Badge variant="outline" className="w-full justify-center">
            Placeholder — not wired yet
          </Badge>
        </aside>

        {/* Results — side-by-side comparison table */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <h3 className="text-base font-semibold text-foreground mb-3">
              Metric comparison
            </h3>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full table-fixed text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-muted-foreground">
                    <th className="w-1/4 py-2.5 px-4 font-medium">Metric</th>
                    <th className="w-1/4 py-2.5 px-4 font-medium" title={embeddingA}>{embeddingA}</th>
                    <th className="w-1/4 py-2.5 px-4 font-medium" title={embeddingB}>{embeddingB}</th>
                    <th className="w-1/4 py-2.5 px-4 font-medium">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {METRIC_ROWS.map((metric) => (
                    <tr key={metric} className="border-t border-border/50">
                      <td className="py-2.5 px-4 text-foreground">{metric}</td>
                      <td className="py-2.5 px-4 tabular-nums text-muted-foreground">{PLACEHOLDER}</td>
                      <td className="py-2.5 px-4 tabular-nums text-muted-foreground">{PLACEHOLDER}</td>
                      <td className="py-2.5 px-4 tabular-nums text-muted-foreground">{PLACEHOLDER}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

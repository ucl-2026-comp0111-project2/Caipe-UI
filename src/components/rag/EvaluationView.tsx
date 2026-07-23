"use client";

/**
 * EvaluationView — RAG evaluation section (UI scaffolding).
 *
 * Split into three tabbed pages that follow the eval workflow:
 *   1. Question Sets   — upload + browse/edit the question dataset
 *   2. Run Experiment  — configure + run an evaluation (the original screen)
 *   3. Leaderboard     — compare saved experiment runs
 *
 * Everything here is INERT — inputs are dummy and every metric is a placeholder.
 * Wiring (Postgres question sets, /v1/query runs, metric computation) is a follow-up.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, FlaskConical, ListChecks, Play, Trophy, Upload } from "lucide-react";
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

type TabId = "questions" | "run" | "leaderboard";

const TABS: { id: TabId; label: string; sublabel: string; icon: typeof ListChecks }[] = [
  { id: "questions", label: "Question Sets", sublabel: "Upload & manage", icon: ListChecks },
  { id: "run", label: "Run Experiment", sublabel: "Configure & run", icon: FlaskConical },
  { id: "leaderboard", label: "Leaderboard", sublabel: "Compare results", icon: Trophy },
];

export default function EvaluationView() {
  const [activeTab, setActiveTab] = useState<TabId>("run");

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
              Upload question sets, run experiments, and compare results
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar — larger than the Ingest source-type pills */}
      <div className="shrink-0 border-b border-border bg-card/30 px-6 py-3">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={isActive ? "default" : "outline"}
                className={`h-12 rounded-lg px-5 gap-2.5 ${isActive ? "shadow-sm" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold">{tab.label}</span>
                  <span className={`text-[11px] font-normal ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {tab.sublabel}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Active page */}
      {activeTab === "questions" && <QuestionSetsPage />}
      {activeTab === "run" && <RunExperimentPage />}
      {activeTab === "leaderboard" && <LeaderboardPage />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page 1 — Question Sets (placeholder)                                */
/* ------------------------------------------------------------------ */

const QUESTION_COLUMNS = ["Question", "Expected answer", "Category", "Expected doc IDs", ""];
const QUESTION_ROWS = 3;

function QuestionSetsPage() {
  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-base font-semibold text-foreground">Question set</h3>
            <p className="text-xs text-muted-foreground">
              Upload a golden question set and inspect or edit it before running an experiment.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Not wired yet</Badge>
            <Button disabled className="gap-1.5">
              <Upload className="h-4 w-4" />
              Upload .jsonl
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-muted-foreground">
                {QUESTION_COLUMNS.map((col, i) => (
                  <th key={i} className="py-2.5 px-4 font-medium">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: QUESTION_ROWS }).map((_, r) => (
                <tr key={r} className="border-t border-border/50">
                  <td className="py-2.5 px-4 text-muted-foreground">{PLACEHOLDER}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{PLACEHOLDER}</td>
                  <td className="py-2.5 px-4 text-muted-foreground">{PLACEHOLDER}</td>
                  <td className="py-2.5 px-4 text-muted-foreground tabular-nums">{PLACEHOLDER}</td>
                  <td className="py-2.5 px-4 text-right">
                    <Button variant="ghost" size="sm" disabled>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollArea>
  );
}

/* ------------------------------------------------------------------ */
/* Page 2 — Run Experiment (original screen, unchanged)               */
/* ------------------------------------------------------------------ */

function RunExperimentPage() {
  const [embeddingA, setEmbeddingA] = useState("nomic-embed-text");
  const [embeddingB, setEmbeddingB] = useState("mxbai-embed-large");

  return (
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
  );
}

/* ------------------------------------------------------------------ */
/* Page 3 — Leaderboard (placeholder)                                  */
/* ------------------------------------------------------------------ */

const LEADERBOARD_COLUMNS = [
  "Run name",
  "Question set",
  "Knowledge base",
  "Top-k",
  "Agent",
  "Recall@k",
  "MRR",
  "nDCG@k",
  "Faithfulness",
];
const LEADERBOARD_ROWS = 3;

function LeaderboardPage() {
  return (
    <ScrollArea className="flex-1">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-base font-semibold text-foreground">Experiment leaderboard</h3>
            <p className="text-xs text-muted-foreground">
              Every saved run with its configuration and metric scores — one row per run.
            </p>
          </div>
          <Badge variant="outline">Not wired yet</Badge>
        </div>

        {/* Filter row (inert) */}
        <div className="flex gap-2 flex-wrap">
          <select disabled className="rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
            <option>Knowledge base: all</option>
          </select>
          <select disabled className="rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
            <option>Agent: all</option>
          </select>
          <select disabled className="rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
            <option>Sort by: Recall@k</option>
          </select>
        </div>

        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-muted-foreground">
                {LEADERBOARD_COLUMNS.map((col) => (
                  <th key={col} className="py-2.5 px-4 font-medium whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: LEADERBOARD_ROWS }).map((_, r) => (
                <tr key={r} className="border-t border-border/50">
                  {LEADERBOARD_COLUMNS.map((col, c) => (
                    <td key={c} className="py-2.5 px-4 text-muted-foreground tabular-nums whitespace-nowrap">
                      {PLACEHOLDER}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollArea>
  );
}

import { useState } from "react";
import { Check, Loader2, AlertTriangle, Circle, Dot, Play, ArrowUpRight, RotateCcw, Copy, ChevronDown } from "lucide-react";
import type { JourneyStage, FleetActionPlan } from "@ge/contracts";
import { ACTION_DISPATCH_MODE, EXECUTABLE_ACTION_KINDS } from "@ge/contracts";
import { statusLabel } from "./status";

// The ONE lifecycle renderer, shared across every GE surface (console views + the deck).
// A real pipeline stepper over the canonical ge.journey.plan (@ge/contracts JourneyStage):
// connectors show progress, each stage has a distinct done/running/blocked/next/pending
// treatment, an expandable detail (owner · task · artifacts · blocker), and an action
// affordance derived from the typed actionPlan + ACTION_DISPATCH_MODE. Read-only without onAction.

const EXECUTABLE = new Set<string>(EXECUTABLE_ACTION_KINDS);
const DONE = new Set(["done", "skipped", "pass", "ready", "success", "completed"]);
const RUNNING = new Set(["running", "queued", "paused", "submitted", "repairing", "warn", "pending"]);
const BAD = new Set(["blocked", "failed", "error", "down"]);

type Phase = "done" | "running" | "blocked" | "pending";
function phaseOf(status: string): Phase {
  const s = String(status || "").toLowerCase();
  if (BAD.has(s)) return "blocked";
  if (DONE.has(s)) return "done";
  if (RUNNING.has(s)) return "running";
  return "pending";
}

// Status node visuals — cohesive with the GE (Google Cloud) palette; one source of truth.
const NODE: Record<Phase, { ring: string; fill: string; text: string; Icon: typeof Check; spin?: boolean }> = {
  done: { ring: "border-emerald-500/40", fill: "bg-emerald-500 text-white", text: "text-emerald-700", Icon: Check },
  running: { ring: "border-primary/40", fill: "bg-primary text-on-primary", text: "text-primary", Icon: Loader2, spin: true },
  blocked: { ring: "border-rose-500/40", fill: "bg-rose-500 text-white", text: "text-rose-700", Icon: AlertTriangle },
  pending: { ring: "border-outline-variant/50", fill: "bg-surface-container text-secondary", text: "text-secondary", Icon: Circle },
};

export interface LifecycleProps {
  stages: JourneyStage[];
  /** id of the next actionable stage (plan.next?.id) — emphasized + auto-expanded. */
  nextId?: string | null;
  /** externally-selected stage id (drill-down); expands its detail. */
  selectedId?: string | null;
  /** called when a stage is selected/toggled. */
  onSelectStage?: (stage: JourneyStage) => void;
  /** called when a stage's action is clicked. Omit for a read-only lifecycle. */
  onAction?: (plan: FleetActionPlan, stage: JourneyStage) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Lifecycle({
  stages,
  nextId = null,
  selectedId = null,
  onSelectStage,
  onAction,
  orientation = "horizontal",
  className = "",
}: LifecycleProps) {
  const [openId, setOpenId] = useState<string | null>(selectedId ?? nextId ?? null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!stages?.length) {
    return (
      <div className={`rounded-lg border border-dashed border-outline-variant/50 px-4 py-6 text-center text-xs text-secondary ${className}`}>
        No lifecycle stages yet.
      </div>
    );
  }

  const expanded = selectedId ?? openId;
  const toggle = (stage: JourneyStage) => {
    setOpenId((cur) => (cur === stage.id ? null : stage.id));
    onSelectStage?.(stage);
  };
  const copy = (id: string, text: string) => {
    void navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(id);
    window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1400);
  };

  const detail = (stage: JourneyStage, phase: Phase) => {
    const plan = stage.actionPlan || null;
    const dispatch = plan ? ACTION_DISPATCH_MODE[plan.kind] : undefined;
    const canRun = Boolean(onAction && plan && (EXECUTABLE.has(plan.kind) || dispatch === "navigate"));
    const cmd = plan?.commands?.[0] || "";
    const RunIcon = dispatch === "navigate" ? ArrowUpRight : dispatch === "resumeTask" ? RotateCcw : Play;
    return (
      <div className="space-y-2 rounded-lg border border-outline-variant/40 bg-surface-container-low/60 p-3 text-xs">
        {stage.blocker?.message && (
          <div className="flex items-start gap-1.5 text-rose-700">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="leading-relaxed">{stage.blocker.message}</span>
          </div>
        )}
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-secondary">
          {stage.owner && (<><dt className="text-secondary/70">Owner</dt><dd className="text-on-surface">{stage.owner}</dd></>)}
          {stage.taskId && (
            <><dt className="text-secondary/70">Task</dt>
              <dd className="flex items-center gap-1.5">
                <code className="truncate font-mono text-[11px] text-on-surface">{stage.taskId}</code>
                <button type="button" onClick={(e) => { e.stopPropagation(); copy(`${stage.id}:task`, stage.taskId!); }} className="text-secondary/60 hover:text-primary" title="Copy task id">
                  <Copy className="h-3 w-3" />
                </button>
                {copied === `${stage.id}:task` && <span className="text-[10px] text-emerald-600">copied</span>}
              </dd></>
          )}
          {Array.isArray(stage.artifacts) && stage.artifacts.length > 0 && (
            <><dt className="text-secondary/70">Artifacts</dt>
              <dd className="space-y-0.5">
                {stage.artifacts.slice(0, 6).map((a, i) => (
                  <div key={i} className="truncate font-mono text-[11px] text-on-surface/80">{typeof a === "string" ? a : (a as any)?.name || (a as any)?.path || JSON.stringify(a)}</div>
                ))}
              </dd></>
          )}
        </dl>
        <div className="flex items-center gap-2 pt-0.5">
          {canRun && plan && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAction!(plan, stage); }}
              className={[
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors",
                dispatch === "navigate" ? "text-primary ring-1 ring-primary/30 hover:bg-primary/10" : "bg-primary text-on-primary hover:bg-primary-container",
              ].join(" ")}
            >
              <RunIcon className={`h-3.5 w-3.5 ${dispatch === "resumeTask" ? "" : ""}`} />
              {plan.label}
            </button>
          )}
          {cmd && !cmd.startsWith("Open ") && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); copy(`${stage.id}:cmd`, cmd); }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] text-secondary ring-1 ring-outline-variant/40 transition-colors hover:text-on-surface hover:ring-outline-variant"
              title={cmd}
            >
              <Copy className="h-3 w-3" />
              {copied === `${stage.id}:cmd` ? "copied" : "copy command"}
            </button>
          )}
          {!canRun && !cmd && phase !== "done" && <span className="text-[11px] text-secondary/60">No action</span>}
        </div>
      </div>
    );
  };

  // ── Vertical timeline ───────────────────────────────────────────────────────
  if (orientation === "vertical") {
    return (
      <div className={className}>
        {stages.map((stage, i) => {
          const phase = phaseOf(stage.status);
          const v = NODE[phase];
          const isOpen = expanded === stage.id;
          const isNext = stage.id === nextId;
          const last = i === stages.length - 1;
          return (
            <div key={stage.id} className="relative flex gap-3" style={{ animation: "ge-stage-in .35s ease-out both", animationDelay: `${i * 45}ms` }}>
              <div className="flex flex-col items-center">
                <span className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${v.ring} ${v.fill}`}>
                  {phase === "running" && <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />}
                  <v.Icon className={`relative h-3.5 w-3.5 ${v.spin ? "animate-spin" : ""}`} strokeWidth={2.5} />
                </span>
                {!last && <span className={`my-0.5 w-0.5 flex-1 ${phase === "done" ? "bg-emerald-500/40" : "bg-outline-variant/40"}`} style={{ minHeight: 14 }} />}
              </div>
              <div className="min-w-0 flex-1 pb-3">
                <button
                  type="button"
                  onClick={() => toggle(stage)}
                  className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface-container/60 ${isNext ? "ring-1 ring-primary/30" : ""}`}
                >
                  <span className={`text-sm font-medium ${phase === "pending" ? "text-secondary" : "text-on-surface"}`}>{stage.label}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${v.text}`}>{statusLabel(stage.status)}</span>
                  {isNext && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">next</span>}
                  <ChevronDown className={`ml-auto h-3.5 w-3.5 text-secondary/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <div className="mt-1.5">{detail(stage, phase)}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Horizontal stepper ──────────────────────────────────────────────────────
  const openStage = stages.find((s) => s.id === expanded) || null;
  return (
    <div className={className}>
      <div className="flex items-stretch">
        {stages.map((stage, i) => {
          const phase = phaseOf(stage.status);
          const v = NODE[phase];
          const isNext = stage.id === nextId;
          const isOpen = expanded === stage.id;
          const last = i === stages.length - 1;
          return (
            <div key={stage.id} className="flex min-w-0 flex-1 flex-col" style={{ animation: "ge-stage-in .35s ease-out both", animationDelay: `${i * 45}ms` }}>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => toggle(stage)}
                  className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform hover:scale-105 ${v.ring} ${v.fill} ${isOpen ? "ring-2 ring-primary/40 ring-offset-1 ring-offset-surface" : ""}`}
                  title={`${stage.label} — ${statusLabel(stage.status)}`}
                >
                  {phase === "running" && <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />}
                  <v.Icon className={`relative h-4 w-4 ${v.spin ? "animate-spin" : ""}`} strokeWidth={2.5} />
                </button>
                {!last && <span className={`h-0.5 flex-1 ${phase === "done" ? "bg-emerald-500/50" : "bg-outline-variant/40"}`} />}
              </div>
              <button type="button" onClick={() => toggle(stage)} className="mt-1.5 pr-2 text-left">
                <div className={`truncate text-[11px] font-medium ${isOpen ? "text-primary" : phase === "pending" ? "text-secondary" : "text-on-surface"}`}>{stage.label}</div>
                <div className={`flex items-center gap-1 text-[10px] ${v.text}`}>
                  {phase === "blocked" && <Dot className="-mx-1 h-3 w-3" />}
                  <span className="truncate">{statusLabel(stage.status)}</span>
                  {isNext && <span className="rounded-full bg-primary/10 px-1 text-[9px] font-bold uppercase tracking-wider text-primary">next</span>}
                </div>
              </button>
            </div>
          );
        })}
      </div>
      {openStage && <div className="mt-3 animate-[ge-stage-in_.25s_ease-out]">{detail(openStage, phaseOf(openStage.status))}</div>}
    </div>
  );
}

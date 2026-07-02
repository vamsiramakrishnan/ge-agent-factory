import { FileText, MessageSquareText, Radio } from "lucide-react";
import { CommandChip } from "@ge/ui";
import { StatusPill } from "../StatusPill";
import type { JourneyStage, RuntimeTaskSummary } from "../../services/geClient";

export function NextActionPanel({ next }: { next: JourneyStage }) {
  return (
    <div className="mt-5 border-t border-outline-variant/30 pt-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Next action</div>
        <StatusPill status={next.status} />
      </div>
      <div className="text-sm font-semibold text-on-surface">{next.label}</div>
      <p className="mt-1 text-xs leading-5 text-secondary">
        {next.blocker?.message || next.actionPlan?.label || "Continue the next incomplete stage."}
      </p>
      {!!next.actionPlan?.commands?.length && (
        <div className="mt-3 flex flex-col items-start gap-1.5">
          {next.actionPlan.commands.map((command) => (
            <CommandChip key={command} command={command} />
          ))}
        </div>
      )}
    </div>
  );
}

export function InterviewContextPanel({
  task,
  activeInterviewId,
  generatedSpecId,
  generatedSpecPath,
  fallbackUsecaseId,
  onRefresh,
}: {
  task: RuntimeTaskSummary | null;
  activeInterviewId: string;
  generatedSpecId: string;
  generatedSpecPath: string;
  fallbackUsecaseId: string;
  onRefresh: () => void;
}) {
  const usecaseId = generatedSpecId || fallbackUsecaseId;
  const specPath = generatedSpecPath || (usecaseId ? `.ge/interviews/${usecaseId}/agent-spec.json` : "");
  const specArtifact = (task?.artifactRefs || []).find((artifact) => artifact.name === "agent-spec" || artifact.path === specPath);
  const present = specArtifact?.status === "present";
  return (
    <div className="mt-5 border-t border-outline-variant/30 pt-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Interview workbench</div>
        <button
          type="button"
          onClick={onRefresh}
          className="text-xs font-medium text-primary hover:text-primary-container"
        >
          Refresh
        </button>
      </div>
      <div className="rounded-md border border-outline-variant/40 bg-surface px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-on-surface">{usecaseId || "No active interview"}</div>
            <div className="mt-1 truncate font-mono text-[11px] text-secondary">{activeInterviewId || "Start an interview to create a task"}</div>
          </div>
          <StatusPill status={task?.status || (activeInterviewId ? "pending" : "missing")} />
        </div>
        <div className="mt-3 rounded bg-surface-container/60 px-2 py-2">
          <div className="text-[11px] font-medium uppercase text-secondary">Generated spec</div>
          <div className="mt-1 truncate font-mono text-[11px] text-secondary" title={specPath || "not planned"}>
            {specPath || "not planned"}
          </div>
          <div className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${present ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700"}`}>
            {present ? "ready" : "waiting"}
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          <button
            type="button"
            onClick={() => { location.hash = "#/interview"; }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/25 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <MessageSquareText className="h-3.5 w-3.5" />
            Open Interview
          </button>
          <button
            type="button"
            onClick={() => {
              if (usecaseId) location.hash = `#/spec-review/${encodeURIComponent(usecaseId)}`;
            }}
            disabled={!usecaseId}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-outline-variant/50 px-3 py-2 text-xs font-medium text-secondary transition-colors hover:bg-surface-container disabled:opacity-50"
          >
            <FileText className="h-3.5 w-3.5" />
            Review Spec
          </button>
          {activeInterviewId && (
            <button
              type="button"
              onClick={() => { location.hash = "#/activity"; }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-outline-variant/50 px-3 py-2 text-xs font-medium text-secondary transition-colors hover:bg-surface-container"
            >
              <Radio className="h-3.5 w-3.5" />
              Watch Run
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

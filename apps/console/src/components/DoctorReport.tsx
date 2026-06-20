import { useState } from "react";
import { StatusPill } from "./StatusPill";
import { useRunFollow } from "../state/runFollow";
import { resolveFix, runFix } from "../lib/doctorFix";
import type { DoctorReport, DoctorSection } from "../services/geClient";

interface DoctorReportProps {
  report: DoctorReport | null;
  loading: boolean;
  failuresOnly?: boolean;
}

// pass/warn/fail tallies for a section's checks — drives the header glyph + counts.
function tally(section: DoctorSection) {
  let pass = 0;
  let warn = 0;
  let fail = 0;
  for (const check of section.checks) {
    if (check.status === "pass") pass++;
    else if (check.status === "warn") warn++;
    else fail++;
  }
  return { pass, warn, fail };
}

function sectionGlyph(fail: number, warn: number) {
  if (fail > 0) return { glyph: "✕", className: "text-rose-600" }; // ✕
  if (warn > 0) return { glyph: "!", className: "text-amber-600" };
  return { glyph: "✓", className: "text-emerald-600" }; // ✓
}

export function DoctorReport({ report, loading, failuresOnly = false }: DoctorReportProps) {
  const { followRun } = useRunFollow();
  const [copied, setCopied] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleCopyFix = async (fix: string, key: string) => {
    try {
      await navigator.clipboard.writeText(fix);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy fix:", err);
      setCopyError(key);
      setTimeout(() => setCopyError(null), 2000);
    }
  };

  const handleRun = (command: string) => {
    void runFix(command, followRun);
  };

  const handleRunAll = () => {
    if (!report?.repairPlan?.length) return;
    let first = true;
    for (const item of report.repairPlan) {
      const resolved = resolveFix(item.command);
      if (!resolved) continue;
      if (first) {
        void runFix(item.command, followRun); // opens the drawer on the first action
        first = false;
      } else {
        void runFix(item.command, () => { /* don't steal the drawer from the first */ });
      }
    }
  };

  if (loading && (!report || report.sections.length === 0)) {
    return (
      <div className="editorial-micro-card rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-12 bg-slate-200/60 rounded-lg animate-pulse motion-reduce:animate-none" />
          <div className="space-y-2">
            <div className="h-8 bg-slate-200/60 rounded w-1/3 animate-pulse motion-reduce:animate-none" />
            <div className="h-6 bg-slate-200/60 rounded w-full animate-pulse motion-reduce:animate-none" />
            <div className="h-6 bg-slate-200/60 rounded w-full animate-pulse motion-reduce:animate-none" />
            <div className="h-6 bg-slate-200/60 rounded w-5/6 animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
        <div className="mt-4 text-sm text-secondary text-center">Running checks...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="editorial-micro-card rounded-lg p-6 text-center text-secondary">
        No report available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!!report.repairPlan?.length && (
        <div className="editorial-micro-card rounded-lg p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-on-surface">Repair Plan</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-secondary">
                {report.repairPlan.length} action{report.repairPlan.length === 1 ? "" : "s"}
              </span>
              {report.repairPlan.some((item) => resolveFix(item.command)) && (
                <button
                  onClick={handleRunAll}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-container"
                >
                  Run all
                </button>
              )}
            </div>
          </div>
          <div className="max-h-72 space-y-2 overflow-auto">
            {report.repairPlan.map((item, idx) => {
              const key = `repair-${item.section || "section"}-${item.check}-${idx}`;
              const runnable = !!resolveFix(item.command);
              return (
                <div key={key} className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded bg-surface-container-low px-2 py-1 font-medium text-secondary">{item.category}</span>
                  <span className="font-medium text-on-surface">{item.check}</span>
                  <code className="ml-auto rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-slate-700">{item.command}</code>
                  {runnable && (
                    <button
                      onClick={() => handleRun(item.command)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      Run
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyFix(item.command, key)}
                    className="rounded-lg px-2.5 py-1 text-xs font-medium text-secondary transition-colors hover:bg-surface-container"
                  >
                    {copied === key ? "Copied" : copyError === key ? "Copy failed" : "Copy"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {report.sections.map((section, idx) => {
        const counts = tally(section);
        const { glyph, className } = sectionGlyph(counts.fail, counts.warn);
        const passing = counts.fail === 0 && counts.warn === 0;
        const collapsed = failuresOnly && passing && !expanded[section.name];

        if (collapsed) {
          return (
            <div key={idx} className="editorial-micro-card rounded-lg px-5 py-3">
              <button
                onClick={() => setExpanded((prev) => ({ ...prev, [section.name]: true }))}
                className="flex w-full items-center gap-2 text-left"
                aria-expanded={false}
              >
                <span className={`text-base font-bold ${className}`} aria-hidden="true">{glyph}</span>
                <span className="text-sm font-semibold text-on-surface">{section.name}</span>
                <span className="text-xs text-secondary">{counts.pass} passed</span>
                <span className="ml-auto text-xs font-medium text-primary">Expand</span>
              </button>
            </div>
          );
        }

        return (
          <div key={idx} className="editorial-micro-card rounded-lg p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`text-base font-bold ${className}`} aria-hidden="true">{glyph}</span>
                <h3 className="text-base font-semibold text-on-surface">{section.name}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                {counts.pass > 0 && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-700">{counts.pass} pass</span>}
                {counts.warn > 0 && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-700">{counts.warn} warn</span>}
                {counts.fail > 0 && <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-rose-700">{counts.fail} fail</span>}
              </div>
            </div>

            <div className="space-y-3">
              {section.checks.map((check, checkIdx) => {
                const fixKey = `${section.name}-${check.name}-${checkIdx}`;
                const runnable = !!check.fix && !!resolveFix(check.fix);
                return (
                  <div key={checkIdx} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <StatusPill status={check.status} />
                      <span className="text-sm font-medium text-on-surface">{check.name}</span>
                      {check.category && check.status !== "pass" && (
                        <span className="rounded bg-surface-container-low px-2 py-0.5 text-[11px] font-medium text-secondary">
                          {check.category}
                        </span>
                      )}
                      {check.detail && (
                        <span className="ml-auto text-xs text-secondary">{check.detail}</span>
                      )}
                    </div>

                    {check.status !== "pass" && check.fix && (
                      <div className="ml-6 flex items-start gap-2">
                        <code className="flex-1 overflow-x-auto rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
                          {check.fix}
                        </code>
                        {runnable && (
                          <button
                            onClick={() => handleRun(check.fix!)}
                            className="whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-container"
                          >
                            Run
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyFix(check.fix!, fixKey)}
                          className="whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          {copied === fixKey ? "Copied" : copyError === fixKey ? "Copy failed" : "Copy"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

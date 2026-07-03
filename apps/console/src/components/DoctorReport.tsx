import { useState } from "react";
import { CommandChip } from "@ge/ui";
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
  if (fail > 0) return { glyph: "✕", className: "text-status-failed-ink" }; // ✕
  if (warn > 0) return { glyph: "!", className: "text-status-warning-ink" };
  return { glyph: "✓", className: "text-status-passed-ink" }; // ✓
}

export function DoctorReport({ report, loading, failuresOnly = false }: DoctorReportProps) {
  const { followRun } = useRunFollow();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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
          <div className="h-12 bg-surface-container rounded-lg animate-pulse motion-reduce:animate-none" />
          <div className="space-y-2">
            <div className="h-8 bg-surface-container rounded w-1/3 animate-pulse motion-reduce:animate-none" />
            <div className="h-6 bg-surface-container rounded w-full animate-pulse motion-reduce:animate-none" />
            <div className="h-6 bg-surface-container rounded w-full animate-pulse motion-reduce:animate-none" />
            <div className="h-6 bg-surface-container rounded w-5/6 animate-pulse motion-reduce:animate-none" />
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
                  <CommandChip command={item.command} className="ml-auto" />
                  {runnable && (
                    <button
                      onClick={() => handleRun(item.command)}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      Run
                    </button>
                  )}
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
                {counts.pass > 0 && <span className="rounded-full bg-status-passed/10 px-2 py-0.5 text-status-passed-ink">{counts.pass} pass</span>}
                {counts.warn > 0 && <span className="rounded-full bg-status-warning/10 px-2 py-0.5 text-status-warning-ink">{counts.warn} warn</span>}
                {counts.fail > 0 && <span className="rounded-full bg-status-failed/10 px-2 py-0.5 text-status-failed-ink">{counts.fail} fail</span>}
              </div>
            </div>

            <div className="space-y-3">
              {section.checks.map((check, checkIdx) => {
                const runnable = !!check.fix && !!resolveFix(check.fix);
                return (
                  <div key={checkIdx} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <StatusPill status={check.status} />
                      <span className="text-sm font-medium text-on-surface">{check.name}</span>
                      {check.category && check.status !== "pass" && (
                        <span className="rounded bg-surface-container-low px-2 py-0.5 text-3xs font-medium text-secondary">
                          {check.category}
                        </span>
                      )}
                      {check.detail && (
                        <span className="ml-auto text-xs text-secondary">{check.detail}</span>
                      )}
                    </div>

                    {check.status !== "pass" && check.fix && (
                      <div className="ml-6 flex items-start gap-2">
                        <CommandChip command={check.fix} className="min-w-0 flex-1" />
                        {runnable && (
                          <button
                            onClick={() => handleRun(check.fix!)}
                            className="whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-container"
                          >
                            Run
                          </button>
                        )}
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

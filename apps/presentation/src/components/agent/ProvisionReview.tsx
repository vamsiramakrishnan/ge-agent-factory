import React, { useMemo } from "react";
import { Rocket, Loader2, ShieldCheck, Database, Server, FileText, AlertTriangle, Rows } from "lucide-react";
import { UseCaseGenerationSpec } from "../../types/architecture";

/**
 * "What will be generated" review derived from the slide's UseCaseGenerationSpec.
 * Provisioning is gated behind the confirm action here so Provision is never a
 * blind fire — the operator sees entity counts, source systems, row policy, doc
 * count, and seeded anomalies, then explicitly confirms.
 */

interface ReviewStat {
  icon: React.ElementType;
  label: string;
  value: string;
}

function deriveStats(spec: UseCaseGenerationSpec): ReviewStat[] {
  const totalRows = spec.entities.reduce((sum, e) => sum + (e.rowCount || 0), 0);
  return [
    { icon: Database, label: "Entities", value: String(spec.entities.length) },
    { icon: Rows, label: "Total Rows", value: `~${totalRows.toLocaleString()}` },
    { icon: Server, label: "Source Systems", value: String(spec.sourceSystems.length) },
    { icon: FileText, label: "Documents", value: String(spec.documents.length) },
    { icon: AlertTriangle, label: "Seeded Anomalies", value: String(spec.anomalies.length) },
  ];
}

export interface ProvisionReviewProps {
  spec: UseCaseGenerationSpec;
  /** True once the operator has confirmed; the panel shows a confirmed state. */
  confirmed: boolean;
  /** Toggle confirmation. */
  onConfirmChange: (confirmed: boolean) => void;
  /** Provision handler — only invokable once confirmed. */
  onProvision: () => void;
  /** Provisioning in flight. */
  busy?: boolean;
  /** Provision is hard-blocked (e.g. preflight failed). Disables the action regardless of confirm. */
  blocked?: boolean;
  /** Reason shown when blocked. */
  blockedReason?: string | null;
}

export function ProvisionReview({ spec, confirmed, onConfirmChange, onProvision, busy, blocked, blockedReason }: ProvisionReviewProps) {
  const stats = useMemo(() => deriveStats(spec), [spec]);
  const rowPolicy = spec.rowPolicy;

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-3 animate-fade-in">
      <div className="flex items-center gap-1.5 mb-2.5">
        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
        <span className="text-[9px] font-headline font-bold uppercase tracking-[0.12em] text-primary">Review Before Provisioning</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="editorial-micro-card rounded-lg p-2 border border-outline-variant/15 bg-white shadow-inner flex flex-col items-center text-center">
              <Icon className="w-3 h-3 text-primary/50 mb-1" />
              <div className="text-sm font-mono font-bold text-on-surface leading-none">{stat.value}</div>
              <div className="text-[7px] font-bold uppercase tracking-wider text-secondary/45 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="text-[9px] font-mono text-secondary/55 mb-3">
        Row policy: <span className="text-on-surface/70 font-bold">{rowPolicy.defaultRowsPerEntity}</span>/entity
        {" "}(min <span className="text-on-surface/70 font-bold">{rowPolicy.minimumRowsPerEntity}</span>, seed {rowPolicy.seed})
      </div>

      <label className="flex items-start gap-2 mb-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => onConfirmChange(e.target.checked)}
          className="mt-0.5 accent-primary w-3.5 h-3.5 shrink-0"
        />
        <span className="text-[10px] text-secondary leading-snug">
          I have reviewed what this run will generate and want to provision this agent into the target project.
        </span>
      </label>

      {blocked && blockedReason && (
        <div className="mb-2.5 text-[9px] text-red-600 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {blockedReason}
        </div>
      )}

      <button
        onClick={onProvision}
        disabled={!confirmed || busy || blocked}
        className="w-full h-9 rounded bg-primary text-white text-[10px] font-headline font-bold shadow-ambient hover:bg-primary-container disabled:opacity-55 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
        {confirmed ? "Provision This Agent" : "Confirm to Provision"}
      </button>
    </div>
  );
}

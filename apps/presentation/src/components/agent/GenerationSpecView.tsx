import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileJson, Database, Server, FileText, Plug, AlertTriangle, ShieldCheck, FlaskConical } from "lucide-react";
import { UseCaseGenerationSpec } from "../../types/architecture";

/**
 * Collapsed, read-only render of a slide's `UseCaseGenerationSpec` — the clean
 * artifact schema the factory consumes. Surfaces entities, source systems,
 * documents, apis, anomalies, the behavior contract, and validation so an
 * operator can inspect exactly what the run was authored to generate before
 * confirming. Purely presentational; never mutates the spec.
 */

interface SubSectionProps {
  icon: React.ElementType;
  label: string;
  count?: number;
  children: React.ReactNode;
}

function SubSection({ icon: Icon, label, count, children }: SubSectionProps) {
  return (
    <div className="rounded-md border border-outline-variant/15 bg-white p-2.5 shadow-inner">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3 h-3 text-primary/55" />
        <span className="text-[8px] font-headline font-bold uppercase tracking-[0.12em] text-secondary/55">{label}</span>
        {typeof count === "number" && (
          <span className="ml-auto text-[8px] font-mono font-bold text-secondary/40">{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}

interface ChipProps {
  // `key` is declared explicitly because these chips are rendered inside .map().
  // React strips it before render; the declaration keeps tsc happy under this config.
  key?: React.Key;
  children: React.ReactNode;
  title?: string;
}

function Chip({ children, title }: ChipProps) {
  return (
    <span title={title} className="editorial-micro-card inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono text-on-surface/70 max-w-full truncate">
      {children}
    </span>
  );
}

function EmptyHint({ children }: { children: string }) {
  return <span className="text-[9px] text-secondary/30">{children}</span>;
}

export interface GenerationSpecViewProps {
  spec: UseCaseGenerationSpec;
  /** Render expanded on first paint. Defaults to collapsed. */
  defaultOpen?: boolean;
}

export function GenerationSpecView({ spec, defaultOpen = false }: GenerationSpecViewProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contract = spec.behaviorContract;

  return (
    <div className="rounded-lg border border-outline-variant/20 bg-surface-container/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-container/60 transition-colors"
      >
        <FileJson className="w-3.5 h-3.5 text-primary/60 shrink-0" />
        <span className="text-[10px] font-headline font-bold text-on-surface">Generation Spec</span>
        <span className="text-[9px] font-mono text-secondary/40">v{spec.version}</span>
        <span className="ml-auto flex items-center gap-2 text-[9px] font-mono text-secondary/45">
          {spec.entities.length} entities · {spec.sourceSystems.length} systems
          {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>

      {open && (
        <div className="px-3 pb-3 pt-1 grid grid-cols-1 md:grid-cols-2 gap-2 animate-fade-in">
          <SubSection icon={Server} label="Source Systems" count={spec.sourceSystems.length}>
            {spec.sourceSystems.length > 0 ? (
              <div className="space-y-1.5">
                {spec.sourceSystems.map((sys) => (
                  <div key={sys.id} className="text-[9px]">
                    <span className="font-headline font-bold text-on-surface/80">{sys.name}</span>
                    <span className="text-secondary/40 font-mono ml-1.5">{sys.protocol}</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {sys.owns.map((o) => <Chip key={o}>{o}</Chip>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyHint>No source systems</EmptyHint>}
          </SubSection>

          <SubSection icon={Database} label="Entities" count={spec.entities.length}>
            {spec.entities.length > 0 ? (
              <div className="space-y-1">
                {spec.entities.map((e) => (
                  <div key={e.name} className="flex items-center justify-between gap-2 text-[9px]">
                    <span className="font-mono text-on-surface/80 truncate">{e.name}</span>
                    <span className="shrink-0 text-secondary/45 font-mono">
                      {e.rowCount} rows · {e.datastore}
                    </span>
                  </div>
                ))}
              </div>
            ) : <EmptyHint>No entities</EmptyHint>}
          </SubSection>

          <SubSection icon={FileText} label="Documents" count={spec.documents.length}>
            {spec.documents.length > 0 ? (
              <div className="space-y-1">
                {spec.documents.map((d) => (
                  <div key={d.id} className="text-[9px]">
                    <span className="font-headline font-bold text-on-surface/80">{d.title}</span>
                    <span className="text-secondary/40 font-mono ml-1.5">{d.type}</span>
                  </div>
                ))}
              </div>
            ) : <EmptyHint>No documents</EmptyHint>}
          </SubSection>

          <SubSection icon={Plug} label="APIs" count={spec.apis.length}>
            {spec.apis.length > 0 ? (
              <div className="space-y-1">
                {spec.apis.map((a, i) => (
                  <div key={a.id ?? a.operation ?? i} className="flex items-center gap-1.5 text-[9px]">
                    <span className="font-mono font-bold text-primary/70">{a.method}</span>
                    <span className="font-mono text-on-surface/70 truncate">{a.path}</span>
                  </div>
                ))}
              </div>
            ) : <EmptyHint>No APIs</EmptyHint>}
          </SubSection>

          <SubSection icon={AlertTriangle} label="Seeded Anomalies" count={spec.anomalies.length}>
            {spec.anomalies.length > 0 ? (
              <ul className="space-y-1">
                {spec.anomalies.map((an) => (
                  <li key={an.id} className="text-[9px] text-secondary/70 leading-snug">{an.description}</li>
                ))}
              </ul>
            ) : <EmptyHint>No seeded anomalies</EmptyHint>}
          </SubSection>

          <SubSection icon={FlaskConical} label="Validation">
            <div className="text-[9px] space-y-1">
              <div className="text-secondary/70 leading-snug">
                <span className="font-headline font-bold text-on-surface/70">Smoke: </span>{spec.validation.smokePrompt}
              </div>
              {spec.validation.assertions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {spec.validation.assertions.map((a, i) => <Chip key={i}>{a}</Chip>)}
                </div>
              )}
            </div>
          </SubSection>

          {contract && (
            <div className="md:col-span-2">
              <SubSection icon={ShieldCheck} label="Behavior Contract">
                <div className="text-[9px] space-y-1">
                  <div className="text-secondary/70 leading-snug">
                    <span className="font-headline font-bold text-on-surface/70">Role: </span>{contract.role}
                  </div>
                  <div className="text-secondary/70 leading-snug">
                    <span className="font-headline font-bold text-on-surface/70">Objective: </span>{contract.primaryObjective}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-0.5 font-mono text-[8px] text-secondary/50">
                    <span>{contract.toolIntents.length} tool intents</span>
                    <span>{contract.escalationRules.length} escalation rules</span>
                    <span>{contract.goldenEvals.length} golden evals</span>
                  </div>
                </div>
              </SubSection>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { EmptyState } from "@ge/ui";
import type { SpecOption } from "../../services/geClient";

export function SpecSearchResults({
  specs,
  selectedId,
  search,
  onSelect,
}: {
  specs: SpecOption[];
  selectedId: string;
  search: string;
  onSelect: (spec: SpecOption) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/40">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/30 bg-surface-container-low px-3 py-2">
        <div className="text-xs font-medium text-secondary">
          {specs.length} result{specs.length === 1 ? "" : "s"}
        </div>
        {search.trim() && (
          <div className="max-w-48 truncate rounded-full bg-primary/5 px-2 py-1 text-3xs font-medium text-primary">
            {search.trim()}
          </div>
        )}
      </div>
      <div className="max-h-96 overflow-auto">
        {specs.length === 0 ? (
          <EmptyState title="No specs match the current search and department." className="py-6" />
        ) : specs.map((spec) => {
          const selected = spec.id === selectedId;
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => onSelect(spec)}
              aria-pressed={selected}
              className={
                "grid w-full gap-2 border-b border-outline-variant/20 px-3 py-3 text-left last:border-b-0 hover:bg-surface-container/60 " +
                (selected ? "bg-primary/5" : "")
              }
            >
              <span className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-on-surface">{spec.title}</span>
                <span className="rounded-full bg-surface-container px-2 py-0.5 text-4xs font-medium uppercase tracking-wide text-secondary">
                  {spec.department || "unknown"}
                </span>
                {selected && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-4xs font-semibold uppercase tracking-wide text-primary">
                    selected
                  </span>
                )}
              </span>
              <span className="font-mono text-3xs text-secondary">{spec.id}</span>
              {(spec.subtitle || spec.description || spec.persona) && (
                <span className="line-clamp-2 text-xs leading-5 text-secondary">
                  {spec.subtitle || spec.description || spec.persona}
                </span>
              )}
              {!!spec.systems?.length && (
                <span className="flex flex-wrap gap-1.5">
                  {spec.systems.slice(0, 5).map((system) => (
                    <span key={system} className="rounded bg-surface-container px-2 py-0.5 text-3xs text-secondary">
                      {system}
                    </span>
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SpecSummary({ spec }: { spec: SpecOption | null }) {
  if (!spec) {
    return (
      <div className="border-l border-outline-variant/50 pl-3 text-sm text-secondary">
        Select a spec to see its systems and source metadata.
      </div>
    );
  }
  return (
    <div className="border-l border-outline-variant/50 pl-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-container px-2 py-1 text-3xs font-medium text-secondary">{spec.department || "unknown"}</span>
        <span className="rounded-full bg-surface-container px-2 py-1 text-3xs font-medium text-secondary">{spec.variantLabel || "Canonical"}</span>
        {spec.hasBehaviorContract && <span className="rounded-full bg-status-passed/10 px-2 py-1 text-3xs font-medium text-status-passed-ink">behavior contract</span>}
      </div>
      <div className="text-sm font-semibold text-on-surface">{spec.title}</div>
      <div className="mt-1 font-mono text-3xs text-secondary">{spec.id}</div>
      {spec.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-secondary">{spec.description}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(spec.systems || []).slice(0, 5).map((system) => (
          <span key={system} className="rounded bg-surface-container px-2 py-1 text-3xs text-secondary">{system}</span>
        ))}
      </div>
    </div>
  );
}

export function BulkSpecPicker({
  specs,
  selectedIds,
  onToggle,
  onClear,
}: {
  specs: SpecOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}) {
  const selected = new Set(selectedIds);
  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/40">
      <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-low px-3 py-2">
        <div className="text-xs font-medium text-secondary">{selectedIds.length} selected</div>
        <button
          type="button"
          onClick={onClear}
          disabled={selectedIds.length === 0}
          className="text-xs font-medium text-primary disabled:text-secondary disabled:opacity-50"
        >
          Clear
        </button>
      </div>
      <div className="max-h-80 overflow-auto">
        {specs.length === 0 ? (
          <EmptyState title="No specs match the current filters." className="py-6" />
        ) : specs.map((spec) => {
          const checked = selected.has(spec.id);
          return (
            <label key={spec.id} className={`grid cursor-pointer gap-3 border-b border-outline-variant/20 px-3 py-2 last:border-b-0 md:grid-cols-[24px_minmax(0,1fr)_180px] ${checked ? "bg-primary/5" : "hover:bg-surface-container/60"}`}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(spec.id)}
                className="mt-1 h-4 w-4 rounded border-outline-variant text-primary"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-on-surface">{spec.title}</span>
                <span className="mt-0.5 block truncate text-3xs text-secondary">{spec.department} · {spec.id}</span>
              </span>
              <span className="hidden truncate text-3xs text-secondary md:block">{(spec.systems || []).slice(0, 3).join(", ")}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Info,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { Button, CONTROL_CLASS, cx } from "@ge/ui";
import { ge, type SystemOption, type SynthesizedSystem } from "../../services/geClient";

/**
 * Systems selector with autocomplete over the known simulated systems plus a
 * "Bring Your Own System" flow that synthesizes a brand-new LIVE simulator from a
 * natural-language description and binds it to the interview.
 *
 * Binding contract is UNCHANGED: the selected systems are surfaced to the parent
 * as a comma-separated string via `onChange`, exactly like the previous free-text
 * input — so startInterview / spec binding picks them up without modification.
 * Typing a raw comma-separated list still works as a fallback (each token becomes
 * a chip on Enter or comma). Blur closes search without committing a partial query.
 */

// The synthesize CLI returns a richer payload than the shared geClient type spells
// out (geClient.SynthesizedSystem is intentionally minimal and shared with other
// callers). These extra fields are present on the wire — `valid`, the
// `validationErrors` that explain a `valid === false`, and the `repairs` count from
// the LLM self-repair pass. We type them locally so the preview can use them
// without changing the shared client surface.
export type SynthResult = SynthesizedSystem & {
  valid?: boolean;
  validationErrors?: string[];
  repairs?: number;
};

// Human-friendly label for the synthesis `source` tier, so the preview sets the
// right quality expectation (LLM vs heuristic vs structural).
const SOURCE_LABELS: Record<string, string> = {
  "nl-llm": "LLM (Vertex)",
  "nl-llm-repaired": "LLM (Vertex, self-repaired)",
  "nl-heuristic": "Heuristic (offline)",
  samples: "From samples",
  openapi: "From OpenAPI",
};

export function sourceLabel(source: string | undefined | null): string {
  if (!source) return "synthesized";
  return SOURCE_LABELS[source] || source;
}

export function toolNames(tools: SynthResult["tools"]): string[] {
  return (tools || [])
    .map((tool) => (typeof tool === "string" ? tool : tool?.name))
    .filter((name): name is string => Boolean(name));
}

/**
 * Pure formatter for the synthesis result → everything the preview card needs to
 * render, with the valid/invalid decision made in one place. Kept side-effect free
 * and exported so it can be unit-tested without mounting the component.
 */
export function summarizeSynthResult(result: SynthResult) {
  const names = toolNames(result.tools);
  const collections = Object.entries(result.collections || {}).map(([name, rows]) => ({
    name,
    rows: Number(rows) || 0,
  }));
  const totalRows = collections.reduce((sum, c) => sum + c.rows, 0);
  // `valid` may be absent on older payloads — treat absence as "ok" so we don't
  // block a successful synthesis on a missing flag, but a literal false blocks.
  const valid = result.valid !== false;
  const errors = Array.isArray(result.validationErrors) ? result.validationErrors.filter(Boolean) : [];
  const repairs = Number(result.repairs) || 0;
  return {
    id: result.id,
    displayName: result.displayName || result.id,
    source: result.source,
    sourceLabel: sourceLabel(result.source),
    toolNames: names,
    toolCount: names.length,
    collections,
    collectionCount: collections.length,
    totalRows,
    repairs,
    valid,
    errors,
    canAdd: valid && Boolean(result.id),
  };
}

export type SynthSummary = ReturnType<typeof summarizeSynthResult>;

export function SystemsField({
  value,
  onChange,
  disabled,
  inputClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputClassName?: string;
}) {
  const [known, setKnown] = useState<SystemOption[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [byoOpen, setByoOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // Systems we synthesized this session, keyed by id, so chips can show a badge.
  const [synthesized, setSynthesized] = useState<Record<string, SynthResult>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => value.split(",").map((item) => item.trim()).filter(Boolean),
    [value],
  );

  useEffect(() => {
    let cancelled = false;
    ge.systems()
      .then((res) => {
        if (!cancelled) setKnown(res.systems || []);
      })
      .catch(() => {
        // Registry unavailable: the field still works as free text + BYO.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the suggestion popover on outside click.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const knownById = useMemo(() => {
    const map = new Map<string, SystemOption>();
    for (const sys of known) map.set(sys.id, sys);
    return map;
  }, [known]);

  const searchTerms = useMemo(
    () => query.trim().toLowerCase().split(/\s+/).filter(Boolean),
    [query],
  );

  const suggestions = useMemo(() => {
    const selectedSet = new Set(selected.map((item) => item.toLowerCase()));
    return known
      .filter((sys) => !selectedSet.has(sys.id.toLowerCase()))
      .filter((sys) => {
        if (!searchTerms.length) return true;
        const haystack = [
          sys.id,
          sys.displayName,
          sys.family || "",
          sys.maturity || "",
        ].join(" ").toLowerCase();
        return searchTerms.every((term) => haystack.includes(term));
      })
      .slice(0, 8);
  }, [known, searchTerms, selected]);

  const exactMatch = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return known.some(
      (sys) => sys.id.toLowerCase() === q || sys.displayName.toLowerCase() === q,
    );
  }, [known, query]);

  const setSelected = (next: string[]) => {
    const deduped = Array.from(new Set(next.map((item) => item.trim()).filter(Boolean)));
    onChange(deduped.join(","));
  };

  const addSystem = (id: string) => {
    if (!id.trim()) return;
    setSelected([...selected, id.trim()]);
    setQuery("");
    setActiveIndex(0);
    setOpen(false);
  };

  const removeSystem = (id: string) => {
    setSelected(selected.filter((item) => item !== id));
  };

  // Free-text fallback: split whatever was typed on commas into chips.
  const commitTyped = () => {
    const tokens = query.split(",").map((t) => t.trim()).filter(Boolean);
    if (tokens.length) {
      setSelected([...selected, ...tokens]);
      setQuery("");
      setActiveIndex(0);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      if (!suggestions.length) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      if (!suggestions.length) return;
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (open && suggestions[activeIndex]) addSystem(suggestions[activeIndex].id);
      else commitTyped();
    } else if (event.key === "," ) {
      event.preventDefault();
      commitTyped();
    } else if (event.key === "Backspace" && !query && selected.length) {
      removeSystem(selected[selected.length - 1]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={
          inputClassName ||
          "flex flex-wrap items-center gap-1.5 rounded-md border border-outline-variant/60 bg-surface-container px-2 py-1.5 focus-within:border-primary/50"
        }
      >
        {selected.map((id) => {
          const synth = synthesized[id];
          const label = synth?.displayName || knownById.get(id)?.displayName || id;
          return (
            <span
              key={id}
              className={
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-medium " +
                (synth
                  ? "border-violet-400/40 bg-violet-500/10 text-violet-700"
                  : "border-primary/20 bg-primary/5 text-primary")
              }
            >
              {synth && <Sparkles className="h-3 w-3" aria-hidden />}
              {label}
              {synth && (
                <span className="rounded-sm bg-violet-500/20 px-1 text-[9px] uppercase tracking-wide">
                  synthesized
                </span>
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeSystem(id)}
                  aria-label={`Remove ${label}`}
                  className="rounded-full p-0.5 hover:bg-black/5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          );
        })}
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            if (query.includes(",")) commitTyped();
            else setOpen(false);
          }}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={selected.length ? "Add a system…" : "Search or type a system…"}
          aria-label="Systems"
          aria-expanded={open}
          role="combobox"
          aria-controls="systems-suggestions"
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-sm text-on-surface outline-none disabled:opacity-60"
        />
      </div>

      {open && !disabled && (suggestions.length > 0 || query.trim()) && (
        <div
          id="systems-suggestions"
          role="listbox"
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border border-outline-variant/60 bg-surface shadow-lg"
        >
          {suggestions.map((sys, index) => (
            <button
              key={sys.id}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => {
                event.preventDefault();
                addSystem(sys.id);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={
                "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm " +
                (index === activeIndex ? "bg-primary/5" : "hover:bg-surface-container")
              }
            >
              <span className="flex flex-col">
                <span className="font-medium text-on-surface">{sys.displayName}</span>
                <span className="font-mono text-[11px] text-secondary">{sys.id}</span>
              </span>
              {sys.family && (
                <span className="shrink-0 rounded-full border border-outline-variant/50 px-2 py-0.5 text-[10px] text-secondary">
                  {sys.family}
                </span>
              )}
            </button>
          ))}
          {query.trim() && !exactMatch && (
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                setByoOpen(true);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 border-t border-outline-variant/40 px-3 py-2 text-left text-sm font-medium text-violet-700 hover:bg-violet-500/5"
            >
              <Sparkles className="h-4 w-4" />
              Define “{query.trim()}” as a new system
            </button>
          )}
        </div>
      )}

      {!disabled && (
        <button
          type="button"
          onClick={() => setByoOpen(true)}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-violet-700 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          Bring your own system
        </button>
      )}

      {byoOpen && (
        <ByoSystemModal
          initialName={query.trim()}
          onClose={() => setByoOpen(false)}
          onAdded={(system) => {
            setSynthesized((prev) => ({ ...prev, [system.id]: system }));
            setSelected([...selected, system.id]);
            setQuery("");
            setByoOpen(false);
          }}
        />
      )}
    </div>
  );
}

/** Minimum description length before "Synthesize" is meaningful. */
export const MIN_DESCRIPTION_LENGTH = 12;

/**
 * BYO panel: describe a system in natural language, synthesize a LIVE simulator,
 * preview its tools + collection row counts + validity, then add it to the
 * interview only when it validates.
 */
function ByoSystemModal({
  initialName,
  onClose,
  onAdded,
}: {
  initialName: string;
  onClose: () => void;
  onAdded: (system: SynthResult) => void;
}) {
  const [displayName, setDisplayName] = useState(initialName);
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SynthResult | null>(null);

  const trimmedDescription = description.trim();
  const tooShort = trimmedDescription.length < MIN_DESCRIPTION_LENGTH;
  const summary = useMemo(() => (result ? summarizeSynthResult(result) : null), [result]);

  const synthesize = async () => {
    if (tooShort) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = (await ge.synthesizeSystem({
        mode: "nl",
        description: trimmedDescription,
        displayName: displayName.trim() || undefined,
      })) as SynthResult;
      if (!res.ok) {
        setError(res.error || "Synthesis failed");
        return;
      }
      setResult(res);
    } catch (err: any) {
      setError(err?.detail || err?.message || "Synthesis failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Bring your own system"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-outline-variant/40 bg-surface shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/40 px-5 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <h2 className="text-sm font-semibold text-on-surface">Bring your own system</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 hover:bg-surface-container">
            <X className="h-4 w-4 text-secondary" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <p className="text-xs text-secondary">
            Describe a system in plain language. We synthesize a live simulator — entities, tools, and
            seeded rows — and bind it to this interview.
          </p>

          <div
            className="flex items-start gap-2 rounded-md border border-outline-variant/40 bg-surface-container/60 px-3 py-2 text-[11px] leading-5 text-secondary"
          >
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden />
            <span>
              An LLM tier (Vertex) is used when available for richer entities and tools. Offline it
              degrades to a heuristic sketch — still usable, lower fidelity.
            </span>
          </div>

          <div>
            <label htmlFor="byo-display-name" className="mb-1 block text-xs font-medium text-secondary">
              Display name (optional)
            </label>
            <input
              id="byo-display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              disabled={busy}
              placeholder="e.g. PartsLedger"
              className={cx(CONTROL_CLASS, "disabled:opacity-60")}
            />
          </div>

          <div>
            <label htmlFor="byo-description" className="mb-1 block text-xs font-medium text-secondary">
              Description
            </label>
            <textarea
              id="byo-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              disabled={busy}
              maxLength={8000}
              placeholder="e.g. parts, requisitions, and an approval flow"
              aria-describedby="byo-description-hint"
              className={cx(CONTROL_CLASS, "resize-y leading-6 disabled:opacity-60")}
            />
            <p id="byo-description-hint" className="mt-1 text-[11px] text-secondary">
              {tooShort
                ? `Add a bit more detail (at least ${MIN_DESCRIPTION_LENGTH} characters) so we can sketch entities and tools.`
                : "Mention the key entities, tools, and any workflow you want simulated."}
            </p>
          </div>

          {/* aria-live region: announces loading, errors, and the result outcome. */}
          <div aria-live="polite" className="space-y-3">
            {busy && (
              <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-on-surface">
                <Loader2 className="h-4 w-4 animate-spin text-primary motion-reduce:animate-none" aria-hidden />
                Synthesizing… spinning up entities, tools, and seed rows.
              </div>
            )}

            {error && !busy && (
              <div className="rounded-md border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                  Synthesis failed
                </div>
                <p className="mt-1 text-rose-700/90">{error}</p>
                <button
                  type="button"
                  onClick={synthesize}
                  disabled={tooShort}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-rose-400/40 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-500/10 disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden />
                  Retry
                </button>
              </div>
            )}

            {summary && !busy && <SynthPreview summary={summary} onRetry={synthesize} retryDisabled={tooShort} />}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-outline-variant/40 px-5 py-3">
          <div className="min-w-0 truncate text-[11px] text-secondary">
            {summary?.canAdd ? (
              <>
                Will add <span className="font-mono text-on-surface">{summary.id}</span>
              </>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {summary ? (
              <button
                type="button"
                onClick={() => result && summary.canAdd && onAdded(result)}
                disabled={!summary.canAdd}
                title={summary.canAdd ? undefined : "Resolve validation errors before adding"}
                className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Add to interview
              </button>
            ) : (
              <Button size="sm" onClick={synthesize} disabled={tooShort} loading={busy}>
                {!busy && <Sparkles className="h-3.5 w-3.5" aria-hidden />}
                {busy ? "Synthesizing…" : "Synthesize"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Result preview card: source tier, validity, tools, collections, repair count.
 * Invalid results surface their validation errors and are NOT addable (the parent
 * disables "Add to interview" via summary.canAdd) — Retry re-runs synthesis.
 */
function SynthPreview({
  summary,
  onRetry,
  retryDisabled,
}: {
  summary: SynthSummary;
  onRetry: () => void;
  retryDisabled?: boolean;
}) {
  const valid = summary.valid;
  return (
    <div
      className={
        "rounded-lg border p-3 " +
        (valid ? "border-violet-400/30 bg-violet-500/5" : "border-rose-400/30 bg-rose-500/5")
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-on-surface">
          <Sparkles className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
          <span className="truncate">{summary.displayName}</span>
        </div>
        {valid ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Valid
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-400/40 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-700">
            <AlertTriangle className="h-3 w-3" aria-hidden />
            Invalid
          </span>
        )}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-secondary">
        <span className="font-mono">{summary.id}</span>
        <span className="rounded-sm bg-violet-500/15 px-1.5 py-0.5 uppercase tracking-wide text-violet-700">
          {summary.sourceLabel}
        </span>
        {summary.repairs > 0 && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-500/15 px-1.5 py-0.5 text-amber-700">
            <Wrench className="h-3 w-3" aria-hidden />
            {summary.repairs} {summary.repairs === 1 ? "repair" : "repairs"}
          </span>
        )}
      </div>

      {!valid && summary.errors.length > 0 && (
        <div className="mt-3 rounded-md border border-rose-400/30 bg-rose-500/10 px-3 py-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-rose-700">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            Validation errors
          </div>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-rose-700/90">
            {summary.errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onRetry}
            disabled={retryDisabled}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-rose-400/40 px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-500/10 disabled:opacity-50"
          >
            <RefreshCw className="h-3 w-3" aria-hidden />
            Retry synthesis
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs font-medium text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Wrench className="h-3.5 w-3.5" aria-hidden />
          Tools <span className="text-on-surface">{summary.toolCount}</span>
        </span>
      </div>
      <div className="mt-1 max-h-28 overflow-y-auto rounded-md border border-outline-variant/30 bg-surface/60 p-1.5">
        {summary.toolNames.length ? (
          <div className="flex flex-wrap gap-1">
            {summary.toolNames.map((name) => (
              <span
                key={name}
                className="rounded-full border border-outline-variant/50 px-2 py-0.5 text-[11px] text-on-surface"
              >
                {name}
              </span>
            ))}
          </div>
        ) : (
          <span className="px-1 text-[11px] text-secondary">No tools synthesized.</span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs font-medium text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5" aria-hidden />
          Collections <span className="text-on-surface">{summary.collectionCount}</span>
        </span>
        <span className="text-secondary">{summary.totalRows} seeded rows</span>
      </div>
      <div className="mt-1 max-h-28 overflow-y-auto rounded-md border border-outline-variant/30 bg-surface/60 p-1.5">
        {summary.collections.length ? (
          <div className="flex flex-wrap gap-1">
            {summary.collections.map((collection) => (
              <span
                key={collection.name}
                className="rounded-md bg-surface-container px-2 py-0.5 text-[11px] text-on-surface"
              >
                {collection.name} <span className="text-secondary">· {collection.rows} rows</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="px-1 text-[11px] text-secondary">No collections seeded.</span>
        )}
      </div>
    </div>
  );
}

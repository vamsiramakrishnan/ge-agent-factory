import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ge, startJob } from "../../services/geClient";
import type { FleetAgent, RuntimeTaskSummary } from "../../services/geClient";
import { PALETTE_ROUTES } from "../../lib/routes";

type Section = "Navigate" | "Actions" | "Agents" | "Runs";

interface PaletteItem {
  id: string;
  section: Section;
  label: string;
  hint?: string; // secondary text shown to the right (department, status, kind…)
  action: () => void | Promise<void>;
}

// "Go to …" entries come from the shared route registry, so the palette and the
// sidebar always agree on names and destinations.
const NAV_ACTIONS: PaletteItem[] = PALETTE_ROUTES.map((r) => ({
  id: `goto-${r.id}`,
  section: "Navigate",
  label: `Go to ${r.label}`,
  action: () => { location.hash = r.hash; },
}));

const COMMAND_ACTIONS: PaletteItem[] = [
  { id: "run-doctor", section: "Actions", label: "Check readiness", action: () => { location.hash = "#/doctor"; } },
  { id: "ge-up", section: "Actions", label: "Stand up platform", action: async () => { await startJob("Stand up platform", ge.up()); } },
  { id: "ge-data-up", section: "Actions", label: "Prepare data plane", action: async () => { await startJob("Prepare data plane", ge.dataUp()); } },
  { id: "ge-mcp-deploy", section: "Actions", label: "Deploy tool plane", action: async () => { await startJob("Deploy tool plane", ge.mcpDeploy()); } },
];

const STATIC_ITEMS: PaletteItem[] = [...NAV_ACTIONS, ...COMMAND_ACTIONS];

const SECTION_ORDER: Section[] = ["Navigate", "Actions", "Agents", "Runs"];

// A run can map to a single agent when its input targets exactly one id; in that
// case we deep-link straight to the agent, otherwise we land on the Runs view.
function runAgentId(task: RuntimeTaskSummary): string | null {
  const ids = task.input?.ids;
  if (Array.isArray(ids) && ids.length === 1 && typeof ids[0] === "string") return ids[0];
  return null;
}

function runLabel(task: RuntimeTaskSummary): string {
  const presented = task.presentation?.title;
  if (presented) return presented;
  if (typeof task.summary === "string" && task.summary.trim()) return task.summary.trim();
  return task.kind || task.id;
}

function agentToItem(a: FleetAgent): PaletteItem {
  return {
    id: `agent-${a.id}`,
    section: "Agents",
    label: a.title || a.id,
    hint: a.department || a.status,
    action: () => { location.hash = `#/agent/${a.id}`; },
  };
}

function runToItem(t: RuntimeTaskSummary): PaletteItem {
  const agentId = runAgentId(t);
  return {
    id: `run-${t.id}`,
    section: "Runs",
    label: runLabel(t),
    hint: t.status || t.kind,
    action: () => { location.hash = agentId ? `#/agent/${agentId}` : "#/activity"; },
  };
}

function matches(query: string, ...fields: Array<string | null | undefined>): boolean {
  const q = query.toLowerCase();
  return fields.some((f) => f && f.toLowerCase().includes(q));
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<FleetAgent[]>([]);
  const [runs, setRuns] = useState<RuntimeTaskSummary[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);

  // Cache the fleet list after the first fetch — it rarely changes within a
  // single palette session and refetching on every keystroke is wasteful.
  const fleetCache = useRef<FleetAgent[] | null>(null);

  const q = query.trim();

  // Static items always reflect the current query (cheap, synchronous).
  const staticMatches = useMemo(
    () => (q ? STATIC_ITEMS.filter((a) => matches(q, a.label)) : STATIC_ITEMS),
    [q],
  );

  // Debounced live lookup against the fleet + recent runs.
  useEffect(() => {
    if (!open) return;
    if (!q) {
      setAgents([]);
      setRuns([]);
      setLoadingLive(false);
      return;
    }
    let cancelled = false;
    setLoadingLive(true);
    const handle = window.setTimeout(async () => {
      try {
        const [fleet, taskList] = await Promise.all([
          fleetCache.current
            ? Promise.resolve({ agents: fleetCache.current })
            : ge.fleet().then((f) => {
                fleetCache.current = f.agents || [];
                return f;
              }),
          ge.runtimeTasks(25).catch(() => ({ tasks: [] as RuntimeTaskSummary[] })),
        ]);
        if (cancelled) return;
        const fleetAgents = fleet.agents || [];
        setAgents(
          fleetAgents
            .filter((a) => matches(q, a.id, a.title, a.department))
            .slice(0, 8),
        );
        setRuns(
          (taskList.tasks || [])
            .filter((t) => matches(q, t.id, runLabel(t)))
            .slice(0, 8),
        );
      } catch {
        if (!cancelled) {
          setAgents([]);
          setRuns([]);
        }
      } finally {
        if (!cancelled) setLoadingLive(false);
      }
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [open, q]);

  // Flat, ordered list backing keyboard nav; grouping is purely presentational.
  const items = useMemo<PaletteItem[]>(() => {
    const live = [...agents.map(agentToItem), ...runs.map(runToItem)];
    const all = [...staticMatches, ...live];
    return SECTION_ORDER.flatMap((section) => all.filter((it) => it.section === section));
  }, [staticMatches, agents, runs]);

  // Keep selection in range as results change.
  useEffect(() => {
    setSelected((s) => (items.length ? Math.min(s, items.length - 1) : 0));
  }, [items.length]);

  // Run an action safely: surface failures inline instead of letting an async
  // action reject as an uncaught promise (e.g. `ge up` when terraform is absent).
  async function runAction(action: () => void | Promise<void>) {
    setError(null);
    setRunning(true);
    try {
      await action();
      onClose();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(0);
      setError(null);
      setRunning(false);
      setAgents([]);
      setRuns([]);
      setLoadingLive(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (items.length) setSelected((s) => (s + 1) % items.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (items.length) setSelected((s) => (s - 1 + items.length) % items.length);
        } else if (e.key === "Enter" && items[selected] && !running) {
          e.preventDefault();
          void runAction(items[selected].action);
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, items, selected, onClose, running]);

  // Walk the flat list once, emitting a header whenever the section changes, so
  // grouping and the keyboard index stay in lockstep.
  let lastSection: Section | null = null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-start justify-center pt-24 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="w-full max-w-xl bg-surface rounded-xl shadow-ambient-lg border border-outline-variant/40 overflow-hidden"
            >
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Search actions, agents, runs..."
                className="w-full px-4 py-3 border-b border-outline-variant/30 focus:outline-none text-sm"
              />
              <div className="max-h-96 overflow-y-auto">
                {items.map((item, i) => {
                  const header = item.section !== lastSection ? item.section : null;
                  lastSection = item.section;
                  return (
                    <div key={item.id}>
                      {header && (
                        <div className="px-4 pt-3 pb-1 text-[11px] font-medium uppercase tracking-wide text-secondary">
                          {header}
                        </div>
                      )}
                      <button
                        disabled={running}
                        onClick={() => void runAction(item.action)}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors disabled:opacity-50 flex items-center justify-between gap-3 ${
                          i === selected
                            ? "bg-primary/10 text-primary"
                            : "text-on-surface hover:bg-surface-container-low"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.hint && (
                          <span className="shrink-0 text-xs text-secondary truncate max-w-[40%]">{item.hint}</span>
                        )}
                      </button>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-secondary">
                    {loadingLive ? "Searching…" : "No matching commands"}
                  </div>
                )}
              </div>
              {loadingLive && items.length > 0 && (
                <div className="px-4 py-2 text-xs text-secondary border-t border-outline-variant/30">Searching live data…</div>
              )}
              {running && (
                <div className="px-4 py-2 text-xs text-secondary border-t border-outline-variant/30">Running…</div>
              )}
              {error && (
                <div className="px-4 py-2 text-xs text-rose-600 bg-rose-500/5 border-t border-rose-500/20 break-words">{error}</div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

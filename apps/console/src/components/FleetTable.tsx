import { useMemo, useState } from "react";
import { Button, EmptyState } from "@ge/ui";
import { StatusPill } from "./StatusPill";
import { Inbox, X } from "lucide-react";
import type { FleetAgent } from "../services/geClient";

interface FleetTableProps {
  agents: FleetAgent[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  allSelected: boolean;
  onRowClick: (id: string) => void;
  totalCount?: number;
  loading?: boolean;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

type SortKey = "id" | "department" | "stage" | "health" | "owner";
type SortDir = "asc" | "desc";

// Value extractors keep sort comparisons aligned with what each column renders.
const SORT_VALUE: Record<SortKey, (a: FleetAgent) => string> = {
  id: (a) => a.id || "",
  department: (a) => a.department || "",
  stage: (a) => a.stage || "spec",
  health: (a) => a.healthStatus || a.status || "",
  owner: (a) => a.owner || "none",
};

function SortCaret({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className={`ml-1 inline-block text-4xs leading-none ${
        active ? "text-primary" : "text-secondary/30"
      }`}
      aria-hidden="true"
    >
      {active ? (dir === "asc" ? "▲" : "▼") : "▲"}
    </span>
  );
}

export function FleetTable({
  agents,
  selected,
  onToggle,
  onToggleAll,
  allSelected,
  onRowClick,
  totalCount,
  loading = false,
  hasFilters = false,
  onClearFilters,
}: FleetTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  // Stable sort: when no sort key is active, preserve the incoming (filtered) order.
  const sortedAgents = useMemo(() => {
    if (!sortKey) return agents;
    const getValue = SORT_VALUE[sortKey];
    const factor = sortDir === "asc" ? 1 : -1;
    return agents
      .map((agent, index) => ({ agent, index }))
      .sort((a, b) => {
        const cmp = getValue(a.agent).localeCompare(getValue(b.agent), undefined, {
          numeric: true,
          sensitivity: "base",
        });
        if (cmp !== 0) return cmp * factor;
        return a.index - b.index; // stable tiebreak on original order
      })
      .map((entry) => entry.agent);
  }, [agents, sortKey, sortDir]);

  if (loading) {
    return (
      <div className="bg-surface rounded-lg border border-outline-variant/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="w-12 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Department</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Health</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Blocker</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Run</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-outline-variant/20">
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-4" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-24" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-48" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-20" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded-full bg-surface-container h-6 w-16" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-16" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-32" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-16" />
                </td>
                <td className="px-4 py-3">
                  <div className="animate-pulse rounded bg-surface-container h-4 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (agents.length === 0) {
    if (hasFilters) {
      return (
        <div className="bg-surface rounded-lg border border-outline-variant/30 px-12 py-4 text-center">
          <EmptyState
            icon={X}
            title="No agents match the current filters"
            action={onClearFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                Clear filters
              </Button>
            )}
          />
        </div>
      );
    }
    return (
      <div className="bg-surface rounded-lg border border-outline-variant/30 px-12 py-4 text-center">
        <EmptyState icon={Inbox} title="No agents in the fleet yet" />
      </div>
    );
  }

  const sortableHeader = (key: SortKey, label: string) => (
    <th className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={() => handleSort(key)}
        aria-sort={sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
        className={`inline-flex items-center text-xs font-semibold uppercase tracking-wider transition-colors hover:text-primary ${
          sortKey === key ? "text-primary" : "text-secondary"
        }`}
      >
        {label}
        <SortCaret active={sortKey === key} dir={sortDir} />
      </button>
    </th>
  );

  return (
    <div>
      <div className="bg-surface rounded-lg border border-outline-variant/30 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-primary"
                  aria-label="Select all"
                />
              </th>
              {sortableHeader("id", "ID")}
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                Title
              </th>
              {sortableHeader("department", "Department")}
              {sortableHeader("stage", "Stage")}
              {sortableHeader("health", "Health")}
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                Blocker
              </th>
              {sortableHeader("owner", "Owner")}
              <th className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                Run
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                onClick={(e) => {
                  if ((e.target as HTMLInputElement).type !== "checkbox") {
                    onRowClick(agent.id);
                  }
                }}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(agent.id)}
                    onChange={() => onToggle(agent.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 cursor-pointer accent-primary"
                    aria-label={`Select ${agent.id}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs font-mono text-on-surface">{agent.id}</code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-on-surface">{agent.title}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-secondary">{agent.department}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-surface-container px-2 py-1 text-xs font-medium text-secondary">
                    {agent.stage || "spec"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={agent.healthStatus || agent.status} />
                </td>
                <td className="px-4 py-3 max-w-xs">
                  {agent.blocker ? (
                    <div className="truncate text-xs text-status-blocked-ink" title={agent.blocker.message}>
                      <span className="font-mono">{agent.blocker.id}</span>: {agent.blocker.message}
                    </div>
                  ) : (
                    <span className="text-xs text-secondary/50">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-secondary">{agent.owner || "none"}</span>
                </td>
                <td className="px-4 py-3">
                  {agent.runtimeTaskId || agent.runId ? (
                    <code className="text-xs font-mono text-secondary">{agent.runtimeTaskId || agent.runId}</code>
                  ) : (
                    <span className="text-xs text-secondary/50">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-center">
        <p className="text-sm text-secondary">
          Showing {sortedAgents.length} of {totalCount ?? agents.length} agents
        </p>
      </div>
    </div>
  );
}

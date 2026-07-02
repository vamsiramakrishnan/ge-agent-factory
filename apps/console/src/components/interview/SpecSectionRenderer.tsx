import { humanizeKey, type SpecSection } from "./artifacts/specArtifact";

/**
 * Structured (non-<pre>) renderer for one agent-spec section. Layout is chosen by
 * the section's `kind` (scalar/list/table/json) computed in specArtifact.ts:
 *   - scalar → inline value
 *   - list   → bulleted strings
 *   - table  → arrays-of-objects rendered as a column table
 *   - json   → nested object as labelled key/value rows
 */
export function SpecSectionRenderer({ section }: { section: SpecSection }) {
  switch (section.kind) {
    case "scalar":
      return <ScalarValue value={section.value} />;
    case "list":
      return <ListValue value={section.value} />;
    case "table":
      return <TableValue rows={section.value} />;
    case "json":
    default:
      return <JsonValue value={section.value} />;
  }
}

function ScalarValue({ value }: { value: any }) {
  if (value == null || value === "") {
    return <span className="text-xs italic text-secondary">not set</span>;
  }
  return <div className="text-sm leading-6 text-on-surface whitespace-pre-wrap">{String(value)}</div>;
}

function ListValue({ value }: { value: any }) {
  const items = Array.isArray(value) ? value : [];
  if (items.length === 0) {
    return <span className="text-xs italic text-secondary">empty</span>;
  }
  return (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2 text-sm leading-6 text-on-surface">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-secondary/60" />
          <span className="min-w-0 whitespace-pre-wrap">{typeof item === "object" ? JSON.stringify(item) : String(item)}</span>
        </li>
      ))}
    </ul>
  );
}

function TableValue({ rows }: { rows: any }) {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) {
    return <span className="text-xs italic text-secondary">empty</span>;
  }
  // Union of keys across rows, capped so a wide spec section stays legible.
  const columns: string[] = [];
  for (const row of list) {
    if (row && typeof row === "object") {
      for (const key of Object.keys(row)) {
        if (!columns.includes(key)) columns.push(key);
      }
    }
  }
  const shown = columns.slice(0, 6);
  return (
    <div className="overflow-x-auto rounded-md border border-outline-variant/40">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-outline-variant/40 bg-surface-container/50">
            {shown.map((column) => (
              <th key={column} className="px-2.5 py-1.5 font-semibold text-secondary">{humanizeKey(column)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((row, index) => (
            <tr key={index} className="border-b border-outline-variant/20 last:border-b-0">
              {shown.map((column) => (
                <td key={column} className="px-2.5 py-1.5 align-top text-on-surface">
                  <Cell value={row?.[column]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value }: { value: any }) {
  if (value == null || value === "") return <span className="text-secondary/60">—</span>;
  if (Array.isArray(value)) {
    return <span className="text-secondary">{value.map((item) => (typeof item === "object" ? JSON.stringify(item) : String(item))).join(", ")}</span>;
  }
  if (typeof value === "object") {
    return <span className="font-mono text-4xs text-secondary">{JSON.stringify(value)}</span>;
  }
  return <span className="whitespace-pre-wrap">{String(value)}</span>;
}

function JsonValue({ value }: { value: any }) {
  if (value == null) return <span className="text-xs italic text-secondary">not set</span>;
  if (typeof value !== "object") return <ScalarValue value={value} />;
  const entries = Object.entries(value);
  if (entries.length === 0) return <span className="text-xs italic text-secondary">empty</span>;
  return (
    <div className="space-y-2">
      {entries.map(([key, child]) => (
        <div key={key} className="grid gap-1 sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)]">
          <div className="text-3xs font-medium uppercase tracking-wide text-secondary">{humanizeKey(key)}</div>
          <div className="min-w-0">
            {child != null && typeof child === "object" ? (
              <pre className="overflow-x-auto rounded bg-surface-container/40 px-2 py-1 text-3xs leading-snug text-secondary whitespace-pre-wrap">
                {JSON.stringify(child, null, 2)}
              </pre>
            ) : (
              <ScalarValue value={child} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import type { SpecSection } from "./artifacts/specArtifact";

/**
 * Inline editor for one agent-spec section.
 *
 * - Scalar sections (string/number/boolean) get a text input / textarea bound
 *   directly to the edited spec.
 * - Complex sections (list/table/json) get a JSON textarea: the user edits the
 *   raw JSON and we parse-validate on change, surfacing a parse error without
 *   clobbering the last valid value.
 */
export function SpecFieldEditor({
  section,
  onChange,
}: {
  section: SpecSection;
  onChange: (value: any) => void;
}) {
  if (section.kind === "scalar") {
    return <ScalarEditor value={section.value} onChange={onChange} />;
  }
  return <JsonEditor value={section.value} onChange={onChange} />;
}

function ScalarEditor({ value, onChange }: { value: any; onChange: (value: any) => void }) {
  const asString = value == null ? "" : String(value);
  const multiline = asString.length > 72 || asString.includes("\n");
  const commit = (next: string) => {
    // Preserve number/boolean type when the original value was one.
    if (typeof value === "number") {
      const num = Number(next);
      onChange(Number.isFinite(num) ? num : next);
    } else if (typeof value === "boolean") {
      onChange(next === "true");
    } else {
      onChange(next);
    }
  };
  if (typeof value === "boolean") {
    return (
      <select
        value={String(value)}
        onChange={(event) => onChange(event.target.value === "true")}
        className="w-full rounded-md border border-outline-variant/60 bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/50"
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }
  return multiline ? (
    <textarea
      value={asString}
      rows={4}
      onChange={(event) => commit(event.target.value)}
      className="w-full resize-y rounded-md border border-outline-variant/60 bg-surface-container px-3 py-2 text-sm leading-6 text-on-surface outline-none focus:border-primary/50"
    />
  ) : (
    <input
      value={asString}
      onChange={(event) => commit(event.target.value)}
      className="w-full rounded-md border border-outline-variant/60 bg-surface-container px-3 py-2 text-sm text-on-surface outline-none focus:border-primary/50"
    />
  );
}

function JsonEditor({ value, onChange }: { value: any; onChange: (value: any) => void }) {
  const [draft, setDraft] = useState(() => safeStringify(value));
  const [error, setError] = useState<string | null>(null);

  // Re-seed the textarea when the underlying value changes from outside (e.g. an
  // accepted agent revision), but only while there's no in-flight parse error.
  useEffect(() => {
    setDraft(safeStringify(value));
    setError(null);
  }, [value]);

  return (
    <div>
      <textarea
        value={draft}
        rows={8}
        spellCheck={false}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          try {
            onChange(JSON.parse(next));
            setError(null);
          } catch (err: any) {
            setError(err?.message || "Invalid JSON");
          }
        }}
        className={`w-full resize-y rounded-md border bg-surface-container px-3 py-2 font-mono text-[11px] leading-snug text-on-surface outline-none ${
          error ? "border-amber-400/60 focus:border-amber-500" : "border-outline-variant/60 focus:border-primary/50"
        }`}
      />
      {error && <div className="mt-1 text-[11px] text-amber-700">JSON error: {error}</div>}
    </div>
  );
}

function safeStringify(value: any): string {
  try {
    return JSON.stringify(value ?? null, null, 2);
  } catch {
    return String(value ?? "");
  }
}

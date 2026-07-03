import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, FileText, Info } from "lucide-react";
import { ge, type InterviewDocument } from "../../services/geClient";
import { formatBytes } from "./DocumentDropzone";

export interface GroundedDocument extends InterviewDocument {
  /** Whether this doc's extracted text is folded into the interview grounding. */
  useForGrounding: boolean;
}

/**
 * Lists uploaded interview documents (merging upload responses with the server's
 * persisted list) and shows a collapsible extracted-text preview for each, with a
 * per-document "Use for grounding" toggle (default ON). The set of selected docs
 * lives in the parent; this component renders and toggles them.
 */
export function DocumentPreview({
  usecaseId,
  documents,
  onChange,
}: {
  usecaseId: string;
  documents: GroundedDocument[];
  onChange: (next: GroundedDocument[]) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  // Hydrate from any previously uploaded docs for this use case on mount.
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    ge.listInterviewDocuments(usecaseId)
      .then((result) => {
        if (cancelled) return;
        onChange(mergeDocuments(documents, result.documents || []));
      })
      .catch(() => {
        /* List is best-effort; uploads still flow through onUploaded. */
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
    // Re-list when the use case id changes (outcome edited before start).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usecaseId]);

  const toggle = (uri: string, useForGrounding: boolean) => {
    onChange(documents.map((doc) => (doc.uri === uri ? { ...doc, useForGrounding } : doc)));
  };

  if (documents.length === 0) {
    return (
      <div className="rounded-md border border-outline-variant/30 bg-surface-container/25 px-3 py-3 text-center text-xs text-secondary">
        {loaded ? "No documents uploaded yet." : "Checking for uploaded documents…"}
      </div>
    );
  }

  const groundingCount = documents.filter((doc) => doc.useForGrounding).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-3xs text-secondary">
        <span>{documents.length} document{documents.length === 1 ? "" : "s"}</span>
        <span>{groundingCount} grounding the interview</span>
      </div>
      {documents.map((doc) => (
        <DocumentRow key={doc.uri} doc={doc} onToggle={(value) => toggle(doc.uri, value)} />
      ))}
    </div>
  );
}

function DocumentRow({ doc, onToggle }: { doc: GroundedDocument; onToggle: (value: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const preview = (doc.text || "").trim();
  return (
    <div className="rounded-md border border-outline-variant/40 bg-surface-container/40">
      <div className="flex items-start gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-0.5 text-secondary hover:text-on-surface"
          aria-label={open ? "Collapse preview" : "Expand preview"}
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-on-surface" title={doc.filename}>
            {doc.filename}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-4xs text-secondary">
            <span>{doc.kind || "file"}</span>
            <span>·</span>
            <span>{formatBytes(doc.bytes)}</span>
            {typeof doc.charCount === "number" && doc.charCount > 0 && (
              <>
                <span>·</span>
                <span>{doc.charCount.toLocaleString()} chars</span>
              </>
            )}
            {doc.truncated && (
              <span className="rounded-full bg-status-warning/10 px-1.5 py-0.5 font-medium text-status-warning-ink">truncated</span>
            )}
          </div>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-3xs font-medium text-secondary">
          <input
            type="checkbox"
            checked={doc.useForGrounding}
            onChange={(event) => onToggle(event.target.checked)}
            className="h-3.5 w-3.5 rounded border-outline-variant text-primary"
          />
          Use for grounding
        </label>
      </div>
      {doc.note && (
        <div className="mx-3 mb-2 flex items-start gap-1.5 rounded bg-status-warning/10 px-2 py-1 text-3xs text-status-warning-ink">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{doc.note}</span>
        </div>
      )}
      {open && (
        <pre className="mx-3 mb-3 max-h-56 overflow-auto rounded border border-outline-variant/30 bg-surface px-3 py-2 text-3xs leading-snug text-secondary whitespace-pre-wrap">
          {preview || "No extracted text available for this document."}
        </pre>
      )}
    </div>
  );
}

/** Merge server-listed docs into the current set, preserving toggle state + order. */
function mergeDocuments(current: GroundedDocument[], listed: InterviewDocument[]): GroundedDocument[] {
  const byUri = new Map<string, GroundedDocument>(current.map((doc) => [doc.uri, doc]));
  for (const doc of listed) {
    const existing = byUri.get(doc.uri);
    byUri.set(doc.uri, { ...doc, useForGrounding: existing ? existing.useForGrounding : true });
  }
  return Array.from(byUri.values());
}

/** The combined grounding text for the selected docs, in upload order. */
export function combinedGroundingText(documents: GroundedDocument[]): string {
  return documents
    .filter((doc) => doc.useForGrounding && (doc.text || "").trim())
    .map((doc) => `# ${doc.filename}\n\n${(doc.text || "").trim()}`)
    .join("\n\n---\n\n");
}

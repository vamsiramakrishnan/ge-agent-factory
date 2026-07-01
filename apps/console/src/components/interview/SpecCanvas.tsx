import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, FileJson, ListChecks, Loader2, Package, Pencil, RefreshCw, Save, X } from "lucide-react";
import {
  ge,
  type GeEvent,
  type MissionArtifactRef,
  type RuntimeTaskSummary,
  type SpecOkfBundle,
  type SpecRegisterResult,
  type SpecReviewResult,
} from "../../services/geClient";
import { createArtifactParser, type ArtifactEvent } from "./artifacts/parser";
import {
  AGENT_SPEC_ARTIFACT_ID,
  emptySpecArtifact,
  reduceSpecArtifact,
  specReadiness,
  specSections,
  type SpecArtifactState,
} from "./artifacts/specArtifact";
import { SpecSectionRenderer } from "./SpecSectionRenderer";
import { SpecFieldEditor } from "./SpecFieldEditor";

type Spec = Record<string, any>;

/**
 * The interview's RIGHT pane: the agent-spec materializing live as a structured,
 * inline-editable artifact (no raw <pre>). Three sources feed it:
 *   1. LIVE STREAM — antigravity.text_delta deltas are fed through a persistent
 *      createArtifactParser + reduceSpecArtifact so the spec renders incrementally.
 *   2. AUTHORITATIVE LOAD — once agent-spec.json lands (artifactRef present) or the
 *      run/stage finishes, ge.reviewSpec() becomes the source of truth (gaps +
 *      summary + parsed spec override the best-effort stream parse).
 *   3. EDITS — a local editedSpec copy backs inline field editing; Save persists it
 *      via ge.saveInterviewSpec, then Register via ge.registerSpec.
 */
export function SpecCanvas({
  usecaseId,
  task,
  events,
  standalone = false,
}: {
  usecaseId: string;
  task: RuntimeTaskSummary | null;
  events: GeEvent[];
  /** Deep-link/spec-review usage: load the authoritative spec on mount (no live run). */
  standalone?: boolean;
}) {
  // ── live stream parse ──────────────────────────────────────────────────────
  const parserRef = useRef(createArtifactParser());
  const processedRef = useRef(0);
  const [streamState, setStreamState] = useState<SpecArtifactState>(emptySpecArtifact());

  // ── authoritative review ───────────────────────────────────────────────────
  const [review, setReview] = useState<SpecReviewResult | null>(null);
  const [reviewing, setReviewing] = useState(false);

  // ── edit state ─────────────────────────────────────────────────────────────
  const [editedSpec, setEditedSpec] = useState<Spec | null>(null);
  const [baseSpec, setBaseSpec] = useState<Spec | null>(null); // the agent's authoritative copy editedSpec was seeded from
  const [editMode, setEditMode] = useState(false);
  const [revisionPending, setRevisionPending] = useState<Spec | null>(null);

  // ── save + register ────────────────────────────────────────────────────────
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState<SpecRegisterResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── OKF export ───────────────────────────────────────────────────────────────
  const [okfBundle, setOkfBundle] = useState<SpecOkfBundle | null>(null);
  const [okfLoading, setOkfLoading] = useState(false);
  const [okfError, setOkfError] = useState<string | null>(null);
  const [okfOpen, setOkfOpen] = useState(false);

  // Reset everything when the use case changes (new interview seed).
  useEffect(() => {
    parserRef.current = createArtifactParser();
    processedRef.current = 0;
    setStreamState(emptySpecArtifact());
    setReview(null);
    setEditedSpec(null);
    setBaseSpec(null);
    setEditMode(false);
    setRevisionPending(null);
    setSavedPath(null);
    setRegistered(null);
    setError(null);
    setOkfBundle(null);
    setOkfError(null);
    setOkfOpen(false);
  }, [usecaseId]);

  // Feed only newly-arrived text deltas through the persistent parser.
  useEffect(() => {
    if (events.length <= processedRef.current) {
      // Stream was reset (e.g. task switch) — rebuild from scratch.
      if (events.length < processedRef.current) {
        parserRef.current = createArtifactParser();
        processedRef.current = 0;
        setStreamState(emptySpecArtifact());
      }
      if (events.length === processedRef.current) return;
    }
    const fresh = events.slice(processedRef.current);
    processedRef.current = events.length;
    // Drain the persistent parser for all fresh deltas first, then fold the
    // resulting artifact events onto the latest state via a functional updater so
    // rapid back-to-back event batches never read a stale streamState.
    const artifactEvents: ArtifactEvent[] = [];
    for (const ev of fresh) {
      if (ev.type !== "antigravity.text_delta") continue;
      const text = ev.data?.value ?? ev.data?.delta ?? ev.line;
      if (typeof text !== "string" || !text) continue;
      for (const artifactEvent of parserRef.current.feed(text)) {
        artifactEvents.push(artifactEvent);
      }
    }
    if (artifactEvents.length === 0) return;
    setStreamState((prev) => artifactEvents.reduce(reduceSpecArtifact, prev));
  }, [events]);

  // Authoritative load when agent-spec lands or the run/stage completes.
  const agentSpecArtifact = useMemo(
    () => findAgentSpecArtifact(task?.artifactRefs || []),
    [task?.artifactRefs],
  );
  const lastEventType = events.length ? events[events.length - 1]?.type : null;
  const present = agentSpecArtifact?.status === "present";
  const completed =
    lastEventType === "stage_done" ||
    lastEventType === "task_done" ||
    task?.status === "succeeded" ||
    task?.status === "done";

  useEffect(() => {
    if (!present && !completed) return;
    let cancelled = false;
    setReviewing(true);
    ge.reviewSpec({ usecaseId })
      .then((next) => {
        if (cancelled) return;
        setReview(next);
        const agentSpec = next.found ? (next.spec as Spec | null) : null;
        if (agentSpec) {
          setBaseSpec((prevBase) => {
            // First authoritative spec, or no local edits → adopt directly.
            if (!prevBase || !editedSpec || !isDirty(editedSpec, prevBase)) {
              setEditedSpec(agentSpec);
              setRevisionPending(null);
              return agentSpec;
            }
            // Local edits diverge from a NEW agent spec → offer accept/reject.
            if (isDirty(agentSpec, prevBase)) {
              setRevisionPending(agentSpec);
            }
            return prevBase;
          });
        }
      })
      .catch((err: any) => {
        if (!cancelled) setError(err.detail || err.message || "Failed to load generated spec");
      })
      .finally(() => {
        if (!cancelled) setReviewing(false);
      });
    return () => {
      cancelled = true;
    };
    // editedSpec is read inside the updater; we deliberately key on the triggers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [present, completed, usecaseId, agentSpecArtifact?.path, lastEventType]);

  // Standalone (spec-review deep link): no live run feeds the canvas, so load the
  // authoritative spec from disk on mount and when the use case changes.
  useEffect(() => {
    if (!standalone) return;
    let cancelled = false;
    setReviewing(true);
    ge.reviewSpec({ usecaseId })
      .then((next) => {
        if (cancelled) return;
        setReview(next);
        if (next.found && next.spec) {
          setBaseSpec(next.spec as Spec);
          setEditedSpec(next.spec as Spec);
        }
      })
      .catch((err: any) => {
        if (!cancelled) setError(err.detail || err.message || "Failed to load generated spec");
      })
      .finally(() => {
        if (!cancelled) setReviewing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [standalone, usecaseId]);

  // The spec to render: edited copy > authoritative review > best-effort stream.
  const activeSpec: Spec | null = editedSpec || (review?.spec as Spec | null) || streamState.spec;
  const sections = useMemo(() => specSections(activeSpec), [activeSpec]);
  const readiness = useMemo(() => specReadiness(activeSpec), [activeSpec]);
  const summary = review?.summary;
  const gaps = review?.gaps || [];
  const dirty = Boolean(editedSpec && baseSpec && isDirty(editedSpec, baseSpec));

  // Register gating mirrors SpecReview: needs a found, parseable, buildable spec
  // from a generated artifact (or whatever the review resolved). Saved edits also
  // unlock registration against the saved path.
  const buildable = Boolean(review?.found && !review.parseError && summary?.buildable);
  const registerablePath = savedPath || (review?.found ? review.path : null);
  const canRegister = Boolean(registerablePath) && (savedPath ? true : buildable) && !registering && !dirty;

  // Console→presentation deploy hand-off: the presentation FactoryProvisionPanel
  // consumes ?spec=<url>; we serve the embedded generationSpec from disk. Requires
  // the spec to be on disk (reviewed or saved) and a configured presentation URL.
  const presentationUrl = (import.meta.env.VITE_PRESENTATION_URL as string | undefined) || "";
  const hasGenerationSpec =
    Boolean(activeSpec?.generationSpec && typeof activeSpec.generationSpec === "object") &&
    Boolean(review?.found || savedPath);
  const deployHref =
    presentationUrl && hasGenerationSpec && !dirty
      ? buildPresentationDeployUrl(presentationUrl, `${window.location.origin}/api/interviews/${encodeURIComponent(usecaseId)}/generation-spec`)
      : null;

  const reload = async () => {
    setReviewing(true);
    setError(null);
    try {
      const next = await ge.reviewSpec({ usecaseId });
      setReview(next);
      if (next.found && next.spec) {
        setBaseSpec(next.spec as Spec);
        setEditedSpec(next.spec as Spec);
        setRevisionPending(null);
      }
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to load generated spec");
    } finally {
      setReviewing(false);
    }
  };

  const updateSection = (key: string, value: any) => {
    setEditedSpec((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const acceptRevision = () => {
    if (!revisionPending) return;
    setEditedSpec(revisionPending);
    setBaseSpec(revisionPending);
    setRevisionPending(null);
  };
  const keepMine = () => {
    // Adopt the agent's spec as the new comparison base so our edits read as the
    // current divergence and a later revision is detected again.
    if (revisionPending) setBaseSpec(revisionPending);
    setRevisionPending(null);
  };

  const save = async () => {
    if (!editedSpec) return;
    setSaving(true);
    setError(null);
    try {
      const result = await ge.saveInterviewSpec(usecaseId, editedSpec);
      setSavedPath(result.path);
      setBaseSpec(editedSpec); // edits are now persisted → no longer dirty
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to save spec edits");
    } finally {
      setSaving(false);
    }
  };

  const register = async () => {
    const input = registerablePath;
    if (!input) return;
    setRegistering(true);
    setError(null);
    try {
      const result = await ge.registerSpec({ input, allowDraft: false, syncCatalog: false });
      setRegistered(result);
      window.localStorage.setItem("ge.pipeline.selectedSpecId", result.id);
    } catch (err: any) {
      setError(err.detail || err.message || "Spec registration failed");
    } finally {
      setRegistering(false);
    }
  };

  // OKF export is available once the spec exists on disk (the server route reads
  // agent-spec.json). Saved edits or a found authoritative review both satisfy it.
  const okfAvailable = Boolean(review?.found || savedPath);

  // Fetch the OKF bundle once and reuse it for both preview and download.
  const loadOkf = async (): Promise<SpecOkfBundle | null> => {
    if (okfBundle) return okfBundle;
    setOkfLoading(true);
    setOkfError(null);
    try {
      const bundle = await ge.interviewOkf(usecaseId);
      setOkfBundle(bundle);
      return bundle;
    } catch (err: any) {
      setOkfError(err.detail || err.message || "Failed to build the Knowledge Bundle (OKF)");
      return null;
    } finally {
      setOkfLoading(false);
    }
  };

  const previewOkf = async () => {
    setOkfOpen(true);
    await loadOkf();
  };

  const downloadOkf = async () => {
    const bundle = await loadOkf();
    if (!bundle) return;
    try {
      // jszip is already a console dependency (used server-side for office docs);
      // assembling the path->markdown map into a .zip client-side needs no new dep.
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (const [path, markdown] of Object.entries(bundle.files)) {
        zip.file(path, markdown);
      }
      const blob = await zip.generateAsync({ type: "blob" });
      triggerDownload(blob, `${bundle.id || usecaseId}-okf.zip`);
    } catch (err: any) {
      setOkfError(err.detail || err.message || "Failed to package the Knowledge Bundle (OKF)");
    }
  };

  const statusLabel = !activeSpec
    ? streamState.status === "streaming"
      ? "Streaming…"
      : "Waiting for the agent"
    : reviewing
      ? "Refreshing"
      : review?.found
        ? buildable
          ? "Buildable"
          : "Needs work"
        : "Draft";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant/40 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileJson className="h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-on-surface">Agent Spec</h2>
            <div className="truncate font-mono text-[11px] text-secondary" title={savedPath || review?.path || `.ge/interviews/${usecaseId}/agent-spec.json`}>
              {savedPath || review?.path || `.ge/interviews/${usecaseId}/agent-spec.json`}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${statusTone(statusLabel)}`}>
            {(streamState.status === "streaming" || reviewing) && <Loader2 className="h-3 w-3 animate-spin" />}
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={reload}
            disabled={reviewing}
            className="rounded-md border border-outline-variant/50 p-1.5 text-secondary hover:bg-surface-container disabled:opacity-50"
            title="Reload authoritative spec"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEditMode((value) => !value)}
            disabled={!activeSpec}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium disabled:opacity-50 ${
              editMode ? "border-primary/40 bg-primary/10 text-primary" : "border-outline-variant/50 text-secondary hover:bg-surface-container"
            }`}
          >
            <Pencil className="h-3.5 w-3.5" />
            {editMode ? "Editing" : "Edit"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-5 mt-3 rounded-md border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
          {error}
        </div>
      )}

      {revisionPending && (
        <div className="mx-5 mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 py-2">
          <div className="text-xs text-primary">The agent updated the spec while you had edits.</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={acceptRevision}
              className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-white hover:bg-primary-container"
            >
              Accept agent's
            </button>
            <button
              type="button"
              onClick={keepMine}
              className="rounded-md border border-outline-variant/50 px-2.5 py-1 text-[11px] font-medium text-secondary hover:bg-surface-container"
            >
              Keep mine
            </button>
          </div>
        </div>
      )}

      <ReadinessStrip readiness={readiness} summary={summary} />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {sections.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant/60 bg-surface-container/30 px-6 text-center">
            <FileJson className="h-7 w-7 text-secondary/60" />
            <p className="mt-3 max-w-sm text-sm text-secondary">
              The agent spec will materialize here as the interview runs — streamed live, then loaded from disk once written.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
              <section key={section.key} className="rounded-lg border border-outline-variant/40 bg-surface p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">{section.label}</h3>
                {editMode ? (
                  <SpecFieldEditor section={section} onChange={(value) => updateSection(section.key, value)} />
                ) : (
                  <SpecSectionRenderer section={section} />
                )}
              </section>
            ))}
          </div>
        )}

        {gaps.length > 0 && (
          <section className="mt-4 rounded-lg border border-outline-variant/40 bg-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              <ListChecks className="h-4 w-4" />
              Registration gates
            </div>
            <ul className="space-y-2">
              {gaps.slice(0, 12).map((gap) => (
                <li key={gap} className="rounded-md bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700">{gap}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/40 px-5 py-3">
        <div className="text-[11px] text-secondary">
          {registered ? (
            <span className="text-emerald-700">Registered {registered.id}. Available in the Pipeline spec selector.</span>
          ) : dirty ? (
            "Unsaved edits — save before registering."
          ) : savedPath ? (
            "Edits saved."
          ) : review?.found && !buildable ? (
            "Resolve the registration gates above to enable Register."
          ) : (
            "Edit fields inline, then save and register the spec."
          )}
        </div>
        <div className="flex items-center gap-2">
          {registered && (
            <a
              href="#/journey"
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-500/15"
            >
              Build {registered.id}
            </a>
          )}
          {deployHref && (
            <a
              href={deployHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
              title="Open this spec in the presentation deploy panel"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Deploy in presentation
            </a>
          )}
          <button
            type="button"
            onClick={previewOkf}
            disabled={!okfAvailable || okfLoading}
            className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant/50 px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-container disabled:opacity-50"
            title={
              okfAvailable
                ? "Preview and download this spec as a Knowledge Bundle (OKF) — a folder of plain Markdown files the agent reads at runtime"
                : "Save or register the spec first to export the Knowledge Bundle (OKF)"
            }
          >
            {okfLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Package className="h-3.5 w-3.5" />}
            Export Knowledge Bundle
          </button>
          {dirty && (
            <button
              type="button"
              onClick={() => {
                if (baseSpec) setEditedSpec(baseSpec);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant/50 px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-container"
            >
              <X className="h-3.5 w-3.5" />
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving" : "Save edits"}
          </button>
          <button
            type="button"
            onClick={register}
            disabled={!canRegister}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-container disabled:opacity-50"
            title={registerablePath || "Spec is not ready to register yet"}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {registering ? "Registering" : "Register spec"}
          </button>
        </div>
      </div>

      {okfOpen && (
        <OkfPreview
          bundle={okfBundle}
          loading={okfLoading}
          error={okfError}
          onDownload={downloadOkf}
          onClose={() => setOkfOpen(false)}
        />
      )}
    </div>
  );
}

/**
 * A lightweight modal that previews the OKF Knowledge Bundle before download:
 * lists the concept files and renders the root index.md (if present) as plain
 * text. Closes on Escape / backdrop click; respects reduced-motion (no animated
 * transitions are used). Accessible via role="dialog" + aria-modal.
 */
function OkfPreview({
  bundle,
  loading,
  error,
  onDownload,
  onClose,
}: {
  bundle: SpecOkfBundle | null;
  loading: boolean;
  error: string | null;
  onDownload: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const files = bundle ? Object.keys(bundle.files).sort() : [];
  const indexKey = files.find((path) => /(^|\/)index\.md$/.test(path)) || files[0] || null;
  const indexBody = indexKey && bundle ? bundle.files[indexKey] : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Knowledge Bundle (OKF) preview"
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-outline-variant/40 bg-surface shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-outline-variant/40 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-on-surface">Knowledge Bundle (OKF)</h3>
              <div className="truncate text-[11px] text-secondary">
                {bundle ? `${bundle.conceptCount} concept${bundle.conceptCount === 1 ? "" : "s"} · ${files.length} file${files.length === 1 ? "" : "s"}` : "Building…"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-outline-variant/50 p-1.5 text-secondary hover:bg-surface-container"
            aria-label="Close preview"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" /> Building the bundle…
            </div>
          )}
          {error && (
            <div className="rounded-md border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">{error}</div>
          )}
          {!loading && !error && bundle && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">Concept files</h4>
                <ul className="space-y-1">
                  {files.map((path) => (
                    <li key={path} className="truncate rounded-md bg-surface-container/50 px-3 py-1.5 font-mono text-[11px] text-on-surface" title={path}>
                      {path}
                    </li>
                  ))}
                </ul>
              </div>
              {indexKey && (
                <div>
                  <h4 className="mb-2 font-mono text-[11px] text-secondary">{indexKey}</h4>
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-md border border-outline-variant/40 bg-surface-container/30 p-3 text-[11px] leading-5 text-on-surface">
                    {indexBody}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-outline-variant/40 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-outline-variant/50 px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-container"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!bundle || loading}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-container disabled:opacity-50"
          >
            <Package className="h-3.5 w-3.5" />
            Download .zip
          </button>
        </div>
      </div>
    </div>
  );
}

/** Trigger a browser download of a Blob with the given filename, then revoke the URL. */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function ReadinessStrip({
  readiness,
  summary,
}: {
  readiness: { systems: number; entities: number; documents: number; evals: number };
  summary: SpecReviewResult["summary"];
}) {
  const cells = [
    { label: "Systems", value: summary?.sourceSystems ?? readiness.systems },
    { label: "Entities", value: summary?.entities ?? readiness.entities },
    { label: "Docs", value: summary?.documents ?? readiness.documents },
    { label: "Evals", value: summary?.goldenEvals ?? readiness.evals },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 border-b border-outline-variant/30 px-5 py-3">
      {cells.map((cell) => (
        <div key={cell.label} className="rounded-md bg-surface-container/50 px-3 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-secondary">{cell.label}</div>
          <div className="mt-0.5 text-lg font-semibold text-on-surface">{cell.value}</div>
        </div>
      ))}
    </div>
  );
}

function findAgentSpecArtifact(artifacts: MissionArtifactRef[]): MissionArtifactRef | null {
  return artifacts.find((artifact) => artifact.name === AGENT_SPEC_ARTIFACT_ID || /agent-spec\.json$/.test(artifact.path || "")) || null;
}

function isDirty(a: Spec | null, b: Spec | null): boolean {
  return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);
}

/**
 * Build the presentation deploy URL with ?spec=<console-url>. Uses URL so the
 * query lands in the search string (not after a hash route), which is where the
 * presentation's FactoryProvisionPanel reads it from.
 */
function buildPresentationDeployUrl(presentationUrl: string, specUrl: string): string | null {
  try {
    const u = new URL(presentationUrl, window.location.origin);
    u.searchParams.set("spec", specUrl);
    return u.toString();
  } catch {
    return null;
  }
}

function statusTone(label: string): string {
  if (label === "Buildable") return "bg-emerald-500/10 text-emerald-700";
  if (label === "Needs work" || label === "Draft") return "bg-amber-500/10 text-amber-700";
  return "bg-surface-container text-secondary";
}

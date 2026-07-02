import { useEffect, useRef, useState } from "react";
import { Copy, ExternalLink, Loader2, Pause, Pin, PinOff, Play, Wifi, X } from "lucide-react";
import { ge, type LedgerEvent } from "../services/geClient";
import { useRunStream, type RunStageView } from "../hooks/useRunStream";
import { useRunScrubber } from "../hooks/useRunScrubber";
import { useRunFollow } from "../state/runFollow";
import { StatusChip, statusStyle, type RunStatus } from "../lib/runStatus";

// The centerpiece live-follow surface. Mounted once in the App shell; driven by
// runFollow (which run + open/pinned) and useRunStream (live ledger reduction).
export function RunDrawer() {
  const { runId, meta, open, pinned, unfollow, pin, unpin, onComplete } = useRunFollow();
  const stream = useRunStream(open ? runId : null);
  const panelRef = useRef<HTMLDivElement>(null);
  const completeFired = useRef(false);

  // Replay: once the run is terminal its event list is complete, and any
  // position in the run is a pure fold over a prefix (useRunScrubber). scrub
  // is the event position being viewed; null = live/latest.
  const [scrub, setScrub] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const scrubView = useRunScrubber(stream.events, scrub);
  useEffect(() => {
    setScrub(null);
    setPlaying(false);
  }, [runId]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setScrub((position) => {
        const next = (position ?? 0) + 1;
        if (next >= stream.events.length) {
          setPlaying(false);
          return null; // reached the end: hand back to the live/latest view
        }
        return next;
      });
    }, 90);
    return () => window.clearInterval(timer);
  }, [playing, stream.events.length]);

  // Reset the fire-once guard whenever we start following a different run.
  // Keying the reset on runId (not on inferring a transient complete=false
  // render) means following an already-complete run B after run A reliably
  // re-arms auto-collapse — the prior approach relied on a complete=false frame
  // that may never commit when B is terminal from its first event.
  useEffect(() => {
    completeFired.current = false;
  }, [runId]);

  // Auto-collapse on terminal frame unless pinned (handled in context).
  useEffect(() => {
    if (stream.complete && !completeFired.current) {
      completeFired.current = true;
      onComplete();
    }
  }, [stream.complete, onComplete]);

  // Esc closes; focus the panel when it opens (accessible drawer).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") unfollow(); };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, unfollow]);

  if (!open || !runId) return null;

  const blocked = stream.status === "blocked";

  return (
    <aside
      ref={panelRef}
      tabIndex={-1}
      role="complementary"
      aria-label="Live run"
      className="fixed right-0 top-0 z-40 flex h-screen w-[420px] max-w-[calc(100vw-1rem)] flex-col border-l border-outline-variant/40 bg-surface shadow-ambient-lg outline-none transition-transform duration-200 motion-reduce:transition-none"
    >
      <Header runId={runId} meta={meta} status={scrubView ? scrubView.status : stream.status} reconnecting={stream.reconnecting} pinned={pinned} onPin={pin} onUnpin={unpin} onClose={unfollow} />

      <div className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        {!stream.hasEvents ? (
          <WaitingState />
        ) : (
          <StageTimeline
            stages={scrubView ? scrubView.stages : stream.stages}
            activeStage={scrubView ? null : stream.activeStage}
            logTail={scrubView ? [] : stream.logTail}
          />
        )}
        {scrubView?.lastEvent && (
          <div className="mt-3 truncate font-mono text-[10px] text-secondary" title={describeEvent(scrubView.lastEvent)}>
            {describeEvent(scrubView.lastEvent)}
          </div>
        )}
        {!scrubView && blocked && stream.blockedReason && (
          <div className="mt-4 rounded-md border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-800">
            {stream.blockedReason}
          </div>
        )}
      </div>

      {stream.complete && stream.events.length > 1 && (
        <ReplayControls
          total={stream.events.length}
          position={scrub}
          playing={playing}
          onSeek={(next) => { setPlaying(false); setScrub(next >= stream.events.length ? null : next); }}
          onPlay={() => { setScrub((position) => (position == null || position >= stream.events.length ? 0 : position)); setPlaying(true); }}
          onPause={() => setPlaying(false)}
        />
      )}

      <Footer runId={runId} blocked={blocked} blockedReason={stream.blockedReason} onClose={unfollow} />
    </aside>
  );
}

function Header({
  runId, meta, status, reconnecting, pinned, onPin, onUnpin, onClose,
}: {
  runId: string;
  meta: { kind?: string; source?: string } | null;
  status: RunStatus;
  reconnecting: boolean;
  pinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(runId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <div className="border-b border-outline-variant/30 px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
          Live run
          {reconnecting && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium normal-case text-amber-700" title="Stream dropped; reconnecting">
              <Wifi className="h-3 w-3 animate-pulse motion-reduce:animate-none" /> reconnecting…
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={pinned ? onUnpin : onPin}
            className={`rounded-md p-1.5 transition-colors ${pinned ? "text-primary" : "text-secondary hover:bg-surface-container hover:text-on-surface"}`}
            title={pinned ? "Unpin (auto-collapse when run completes)" : "Pin (keep open after completion)"}
            aria-pressed={pinned}
          >
            {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
            title="Close (Esc)"
            aria-label="Close run drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={copy}
          className="group inline-flex min-w-0 items-center gap-1.5 font-mono text-xs text-on-surface"
          title="Copy run id"
        >
          <span className="truncate">{runId}</span>
          <Copy className="h-3 w-3 shrink-0 text-secondary group-hover:text-on-surface" />
          {copied && <span className="text-[10px] text-emerald-600">copied</span>}
        </button>
        <StatusChip status={status} className="ml-auto shrink-0" />
      </div>
      {(meta?.kind || meta?.source) && (
        <div className="mt-1 truncate text-[11px] text-secondary">
          {[meta?.kind, meta?.source].filter(Boolean).join(" · ")}
        </div>
      )}
    </div>
  );
}

function WaitingState() {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-3 text-secondary">
      <Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none" />
      <span className="text-sm">Waiting for first event…</span>
    </div>
  );
}

function StageTimeline({ stages, activeStage, logTail }: { stages: RunStageView[]; activeStage: string | null; logTail: string[] }) {
  if (!stages.length) {
    return <div className="text-sm text-secondary">No stages reported yet.</div>;
  }
  return (
    <ol className="space-y-1">
      {stages.map((stage) => {
        const active = stage.name === activeStage && stage.status === "running";
        return (
          <li key={stage.id}>
            <StageRow stage={stage} active={active} />
            {active && logTail.length > 0 && (
              <div className="ml-[1.05rem] mt-1 border-l border-outline-variant/40 pl-3">
                <div className="space-y-0.5 font-mono text-[10px] leading-snug text-secondary/80">
                  {logTail.slice(-6).map((line, i) => (
                    <div key={i} className="truncate" title={line}>
                      <span className="mr-1 select-none text-secondary/50">▏</span>{line}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StageRow({ stage, active }: { stage: RunStageView; active: boolean }) {
  const style = statusStyle(stage.status);
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className={`w-4 shrink-0 text-center text-sm leading-none ${style.textClass} ${stage.status === "running" ? "animate-pulse motion-reduce:animate-none" : ""}`}
        aria-hidden
      >
        {style.icon}
      </span>
      <span className={`flex-1 truncate text-sm ${active ? "font-semibold text-on-surface" : "text-on-surface"}`}>
        {stage.name.replace(/_/g, " ")}
      </span>
      <span className={`shrink-0 text-[11px] ${style.textClass}`}>{style.label.toLowerCase()}</span>
      {stage.startedAt && (
        <span className="w-12 shrink-0 text-right font-mono text-[11px] text-secondary tabular-nums">
          {formatElapsed(stage.elapsedMs)}
        </span>
      )}
    </div>
  );
}

function Footer({ runId, blocked, blockedReason, onClose }: { runId: string; blocked: boolean; blockedReason: string | null; onClose: () => void }) {
  const [resuming, setResuming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resume = async () => {
    setResuming(true);
    setError(null);
    try {
      await ge.runtimeResume(runId);
    } catch (e: any) {
      setError(e?.message || "Failed to resume run");
    } finally {
      setResuming(false);
    }
  };

  const openFull = () => {
    location.hash = `#/activity?task=${encodeURIComponent(runId)}`;
    onClose();
  };

  return (
    <div className="border-t border-outline-variant/30 px-4 py-3">
      {error && <div className="mb-2 text-xs text-rose-600">{error}</div>}
      <div className="flex items-center gap-2">
        {blocked && (
          <button
            onClick={resume}
            disabled={resuming}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-container disabled:opacity-50"
            title={blockedReason || "Resume this run"}
          >
            {resuming ? <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" /> : null}
            {resuming ? "Resuming…" : "Resume"}
          </button>
        )}
        <button
          onClick={openFull}
          className="inline-flex items-center gap-1.5 rounded-md border border-outline/30 px-3 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Open full
        </button>
        <button
          onClick={onClose}
          className="ml-auto rounded-md px-3 py-2 text-xs font-medium text-secondary transition-colors hover:bg-surface-container"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function describeEvent(ev: LedgerEvent): string {
  const stage = ev.stage ? `[${ev.stage}] ` : "";
  return `${stage}${String(ev.type).replace(/_/g, " ")}${ev.error ? ` — ${ev.error}` : ""}`;
}

// Replay scrubber for a terminal run: play/pause + a position slider over the
// recorded event stream. Position N renders the run as it looked after event
// N (a pure reducer fold); the far right is the live/latest view.
function ReplayControls({
  total, position, playing, onSeek, onPlay, onPause,
}: {
  total: number;
  position: number | null;
  playing: boolean;
  onSeek: (position: number) => void;
  onPlay: () => void;
  onPause: () => void;
}) {
  const value = position ?? total;
  return (
    <div className="border-t border-outline-variant/30 px-4 py-2.5">
      <div className="flex items-center gap-3">
        <button
          onClick={playing ? onPause : onPlay}
          className="rounded-md p-1.5 text-primary transition-colors hover:bg-primary/10"
          title={playing ? "Pause replay" : "Replay this run"}
          aria-label={playing ? "Pause replay" : "Replay this run"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={total}
          value={value}
          onChange={(event) => onSeek(Number(event.target.value))}
          className="w-full accent-primary"
          aria-label="Replay position"
        />
        <span className="w-16 shrink-0 text-right font-mono text-[10px] text-secondary tabular-nums">
          {position == null ? "latest" : `${value}/${total}`}
        </span>
      </div>
    </div>
  );
}

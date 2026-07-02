import { CommandChip } from "@ge/ui";

// Pull a copyable fix command out of an error message. Several server errors
// already embed the exact fix as a backtick-quoted shell command (e.g. "run
// `npm run use-cases:sync`" from the missing-catalog error) — this just makes
// that command a one-click Copy affordance instead of inert prose the operator
// has to select by hand.
function extractCommand(message: string): string | null {
  const match = message.match(/`([^`]+)`/);
  return match ? match[1] : null;
}

interface ErrorBannerProps {
  message: string;
  tone?: "rose" | "amber";
  label?: string;
  onRetry?: () => void;
  className?: string;
}

const TONE_CLASSES: Record<"rose" | "amber", { box: string; text: string; button: string }> = {
  rose: {
    box: "border-status-failed/20 bg-status-failed/10",
    text: "text-status-failed-ink",
    button: "border-status-failed/30 text-status-failed-ink hover:bg-status-failed/10",
  },
  amber: {
    box: "border-status-warning/20 bg-status-warning/10",
    text: "text-status-warning-ink",
    button: "border-status-warning/30 text-status-warning-ink hover:bg-status-warning/10",
  },
};

// A dead-end-proof error surface: names the problem (the raw message), then —
// whenever the message carries a `backtick command` — renders the fix as the
// canonical <CommandChip> so it's one click from the clipboard instead of a
// plain wall of red/amber text. Falls back to a Retry button (or nothing)
// when there's no embedded command.
export function ErrorBanner({ message, tone = "rose", label, onRetry, className = "" }: ErrorBannerProps) {
  const command = extractCommand(message);
  const cls = TONE_CLASSES[tone];

  return (
    <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${cls.box} ${cls.text} ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {label && <span className="font-medium">{label} </span>}
          {message}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {command && <CommandChip command={command} />}
          {onRetry && (
            <button
              onClick={onRetry}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${cls.button}`}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

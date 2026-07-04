import { statusStyle, statusLabel, type StatusValue } from "./status";

// State the way an instrument shows it: a recessed indicator lamp in a
// neutral housing, with the label engraved beside it. The housing never
// tints — the lamp carries the color, the ink shade carries the word.
interface StatusPillProps {
  status: StatusValue;
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const tone = statusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface px-2.5 py-0.5 text-3xs font-semibold uppercase tracking-[0.08em] ${tone.text} ${className}`}
    >
      <span className={`lamp h-2 w-2 rounded-full ${tone.dot}`} />
      {statusLabel(status)}
    </span>
  );
}

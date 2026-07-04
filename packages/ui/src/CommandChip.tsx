import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cx } from "./cx";

// The one way a suggested CLI command renders: a `$`-prefixed mono chip with
// a copy button. Replaces the inert <code> spans (and per-view bespoke Copy
// buttons) scattered across Overview, Doctor, and the pipeline panels — every
// command the console suggests should be one click from the clipboard.
export interface CommandChipProps {
  command: string;
  className?: string;
}

export function CommandChip({ command, className }: CommandChipProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch { /* clipboard unavailable */ }
  };

  return (
    // Commands are terminal content, so they render behind the instrument's
    // readout glass (tokens.css .dial-window), not on the chassis.
    <span
      className={cx(
        "dial-window inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs",
        className,
      )}
    >
      <span className="select-none text-white/40" aria-hidden="true">$</span>
      <span className="min-w-0 break-all">{command}</span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy command"
        title="Copy command"
        className="shrink-0 rounded p-0.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        {copied
          ? <Check className="h-3.5 w-3.5 text-status-passed" aria-hidden />
          : <Copy className="h-3.5 w-3.5" aria-hidden />}
      </button>
    </span>
  );
}

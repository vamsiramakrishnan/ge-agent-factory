/**
 * Token/char budget guard for grounding documents fed into the interview prompt.
 *
 * The interview agent's context window is finite, and a single uploaded BRD can be
 * far larger than we want to inline. `clampGrounding` trims the combined extracted
 * text to a cap, breaking on a sentence/line boundary near the limit so the agent
 * never sees a hard mid-word cut.
 */

export interface ClampedGrounding {
  text: string;
  truncated: boolean;
}

/**
 * Trim `text` to at most ~`maxChars`, preferring a clean break at the nearest
 * sentence end or line boundary that sits within the last ~15% of the budget.
 * Pure + allocation-light; safe to call on every keystroke.
 */
export function clampGrounding(text: string, maxChars = 12000): ClampedGrounding {
  const normalized = (text ?? "").trim();
  if (normalized.length <= maxChars) {
    return { text: normalized, truncated: false };
  }

  const hardSlice = normalized.slice(0, maxChars);
  // Look for a clean boundary in the tail window so we don't lop a sentence in half.
  const windowStart = Math.floor(maxChars * 0.85);
  const candidates = [
    hardSlice.lastIndexOf(". "),
    hardSlice.lastIndexOf(".\n"),
    hardSlice.lastIndexOf("!\n"),
    hardSlice.lastIndexOf("?\n"),
    hardSlice.lastIndexOf("\n\n"),
    hardSlice.lastIndexOf("\n"),
  ].filter((idx) => idx >= windowStart);

  const cut = candidates.length ? Math.max(...candidates) + 1 : maxChars;
  const trimmed = hardSlice.slice(0, cut).trim();
  return {
    text: `${trimmed}\n\n[grounding truncated to ${maxChars.toLocaleString()} characters]`,
    truncated: true,
  };
}

// tools/ge/ui.mjs — the ge CLI's terminal design system.
//
// Every human-facing screen in tools/ge/* is composed from these primitives.
// They exist so a screen is *assembled*, not hand-painted: alignment is
// computed (never a hardcoded .padEnd(N)), color carries exactly one meaning
// per hue, and the next-step affordance has one shape everywhere. All
// primitives RETURN strings — callers print via shared.mjs `out()` — so they
// compose, unit-test, and never touch the --json contract (which lives on the
// other side of emit()).
//
// ── COLOR BUDGET ────────────────────────────────────────────────────────────
// Each hue means one thing. If a use doesn't match the meaning, it's wrong:
//   cyan    typeable/clickable ONLY — commands you can paste (cmd()), ids,
//           URLs. The single decorative-looking use of cyan that is allowed.
//           (The status ramp also resolves queued/running/repairing to ANSI
//           cyan — that is the ramp's "in motion" identity, not decoration.)
//   ramp    state verdicts ONLY — green passed / red failed·blocked /
//           yellow warning / cyan in-motion, always resolved through
//           @ge/design/status-ramp so TTY and console can never disagree.
//   dim     metadata — paths, timestamps, explanations, secondary detail.
//   bold    at most one element per screen (the title) plus section heads.
//   yellow  NEVER decoration — it is the warning tone and nothing else.
// Plain (uncolored) text is the default and carries the primary content.
//
// ── GLYPH SET ───────────────────────────────────────────────────────────────
// One coherent set, pinned to the shared ramp's seven tones. Shape encodes
// the state class (so the set survives NO_COLOR), color encodes the verdict:
//   ✓ passed      solid check — done and good           (green)
//   ✗ failed      cross — done and bad                  (red)
//   ⊘ blocked     barred circle — cannot proceed        (red; 16-color has no orange)
//   ▲ warning     hazard triangle — attention, not fatal (yellow)
//   ● running     filled dot — in motion now            (cyan)
//   ○ queued      hollow dot — will run, hasn't yet     (cyan)
//   ◆ repairing   diamond — in motion, converging back  (cyan)
// shared.mjs re-exports ICON as an alias into this set so legacy call sites
// keep working while they migrate.
//
// ── SPACING RHYTHM ──────────────────────────────────────────────────────────
// Blocks (title / section / divider / next) carry their OWN leading blank
// line; lines inside a block are contiguous. Rendering blocks back-to-back
// therefore yields exactly one blank line between them, and a screen never
// ends in trailing blank spam. Body content indents two spaces under the
// title; nested detail indents two more.
import pc from "picocolors";
import { STATUS_RAMP, statusTone, statusAnsi } from "@ge/design/status-ramp";

// ── TTY awareness ───────────────────────────────────────────────────────────
// Live-redraw behaviors (screen clears, spinner-ish loops) are only welcome
// at a real terminal; when piped, renderers must append instead of repaint.
// picocolors already disables color for non-TTY/NO_COLOR — this guard is for
// *behavioral* differences, not color.
export function isInteractive() {
  return Boolean(process.stdout.isTTY);
}

// ── width math (ANSI-safe) ──────────────────────────────────────────────────
// Values may arrive pre-colored (a statusWord(), a cmd()); alignment must
// measure what the *eye* sees, so every pad in this file strips escapes first.
const ANSI_RE = /\x1b\[[0-9;]*m/g;
export const stripAnsi = (text) => String(text).replace(ANSI_RE, "");
export const visibleWidth = (text) => stripAnsi(text).length;
export function padVisible(text, width) {
  const gap = width - visibleWidth(text);
  return gap > 0 ? String(text) + " ".repeat(gap) : String(text);
}

// ── glyphs & status words ───────────────────────────────────────────────────
const GLYPH_SHAPES = {
  passed: "✓",
  failed: "✗",
  blocked: "⊘",
  warning: "▲",
  running: "●",
  queued: "○",
  repairing: "◆",
};

// glyph(tone) — the colored status glyph for a ramp tone. Accepts loose
// operator spellings ("done", "fail", "warn") via the ramp's own alias table,
// so call sites never re-implement status normalization.
export function glyph(tone) {
  const resolved = statusTone(tone);
  return pc[STATUS_RAMP[resolved].ansi](GLYPH_SHAPES[resolved] || GLYPH_SHAPES.warning);
}

// statusWord(status) — the status, spelled as given, in its ramp color.
// (Same bytes as shared.mjs statusText(), which now delegates here.)
export function statusWord(status) {
  return pc[statusAnsi(status)](status || "unknown");
}

// ── typeable text ───────────────────────────────────────────────────────────
// cmd(text) — how a command (or any paste-able target: id, URL) renders,
// anywhere. The ONLY decorative use of cyan the budget allows.
export const cmd = (text) => pc.cyan(text);

// ── screen anatomy ──────────────────────────────────────────────────────────
// title(text, context?) — one screen title shape: leading blank line, bold
// title, optional dim "— context" suffix. The screen's single bold element
// (section heads aside).
export function title(text, context) {
  return "\n" + pc.bold(text) + (context ? pc.dim(` — ${context}`) : "");
}

// section(heading, suffix?) — bold section head, indented into the body,
// with the block's leading blank line. `suffix` (pre-colored, e.g. a fail
// count) rides after the heading without inheriting bold.
export function section(heading, suffix) {
  return "\n" + pc.bold(`  ${heading}`) + (suffix ? `  ${suffix}` : "");
}

// divider(label?) — THE one horizontal-rule style: a dim ── rule at total
// width 56, with an optional label breaking it near the left. Blocks below a
// divider are a change of register (e.g. golden path → Operate detail).
const DIVIDER_WIDTH = 56;
export function divider(label) {
  if (!label) return "\n" + pc.dim(`  ${"─".repeat(DIVIDER_WIDTH)}`);
  const tail = Math.max(0, DIVIDER_WIDTH - label.length - 4);
  return "\n" + pc.dim(`  ── ${label} ${"─".repeat(tail)}`);
}

// ── key/value block ─────────────────────────────────────────────────────────
// kv(rows) — the aligned label column that replaces every hardcoded
// .padEnd(12/16/22/24/28/30). Rows are:
//   [key, value]                      plain row
//   { key, value, glyph?, note? }     glyph: a ramp tone (renders before the
//                                     key); note: dim trailing metadata
// The key column is measured from the longest key in THIS block — alignment
// is local truth, not a magic number. When any row carries a note, the value
// column is measured the same way so notes rag right of ONE line, not many.
// Values may carry pre-colored text. Falsy rows are skipped so callers can
// write conditionals inline. Returns "" for an all-falsy block (callers of
// maybe-empty blocks should skip printing it).
export function kv(rows, { indent = 2 } = {}) {
  const items = rows.filter(Boolean).map((row) =>
    Array.isArray(row) ? { key: row[0], value: row[1] } : row);
  const anyGlyph = items.some((row) => row.glyph !== undefined);
  const anyNote = items.some((row) => row.note);
  const keyWidth = Math.max(...items.map((row) => visibleWidth(row.key)), 0);
  const valueWidth = anyNote ? Math.max(...items.map((row) => visibleWidth(row.value ?? "")), 0) : 0;
  const pad = " ".repeat(indent);
  return items.map((row) => {
    const lead = anyGlyph ? `${row.glyph === undefined ? " " : glyph(row.glyph)} ` : "";
    const value = row.note ? `${padVisible(row.value ?? "", valueWidth)}  ${pc.dim(row.note)}` : `${row.value ?? ""}`;
    return `${pad}${lead}${padVisible(row.key, keyWidth)}   ${value}`.trimEnd();
  }).join("\n");
}

// ── the next-step affordance ────────────────────────────────────────────────
// next(command, note?) — THE single "what do I type now" shape: always the
// last block on a screen, always a cyan command with an optional dim note.
// No colon, no arrow, no per-command invention.
export function next(command, note) {
  return `\n  next  ${cmd(command)}${note ? `   ${pc.dim(`(${note})`)}` : ""}`;
}

// nextList(commands) — the multi-step plan variant: $-prefixed, one command
// per line, notes aligned in a computed column. Items are strings or
// { command, note }.
export function nextList(commands) {
  const items = commands.filter(Boolean).map((item) =>
    typeof item === "string" ? { command: item } : item);
  const width = Math.max(...items.map((item) => visibleWidth(item.command)), 0);
  return items.map(({ command, note }) =>
    `  ${pc.dim("$")} ${note ? `${padVisible(cmd(command), width)}   ${pc.dim(note)}` : cmd(command)}`,
  ).join("\n");
}

// fixLine(fix, indent?) — the remediation affordance under a failed check:
// the same dim-label + typeable-command shape as the DxError boundary's
// "fix:" line in shared.mjs guarded(), so every fix on every screen reads
// identically.
export function fixLine(fix, indent = 6) {
  return `${" ".repeat(indent)}${pc.dim("fix:")} ${cmd(fix)}`;
}

// ── simple table ────────────────────────────────────────────────────────────
// columns(rows, spec) — the list-view table (runs list, fleet status, repair
// runs). Widths are computed per column from the actual (ANSI-stripped)
// content, headers render dim, the last column never pads (no trailing
// whitespace). spec: [{ header, value(row) → string (may be pre-colored) }].
// Pass header: "" to keep a column unlabeled.
export function columns(rows, spec, { indent = 2 } = {}) {
  const cells = rows.map((row) => spec.map((col) => String(col.value(row) ?? "")));
  const widths = spec.map((col, i) =>
    Math.max(visibleWidth(col.header || ""), ...cells.map((line) => visibleWidth(line[i])), 0));
  const pad = " ".repeat(indent);
  const render = (line) => pad + line
    .map((cell, i) => (i === line.length - 1 ? cell : padVisible(cell, widths[i])))
    .join("  ").trimEnd();
  const lines = [];
  if (spec.some((col) => col.header)) lines.push(render(spec.map((col) => pc.dim(col.header || ""))));
  for (const line of cells) lines.push(render(line));
  return lines.join("\n");
}

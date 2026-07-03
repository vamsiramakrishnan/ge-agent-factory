// Status ramp — the ONE semantic status→color vocabulary, from TTY to UI.
//
// Canonical source for the seven status hues (plus the synthesized accent).
// Two consumers, one identity:
//   - packages/design/src/tokens.css — the `--color-status-*` @theme region is
//     GENERATED from this table (see scripts/gen-tokens.mjs; drift-checked by
//     tools/check-design-tokens.mjs), and packages/ui/src/status.ts maps the
//     resulting Tailwind utilities onto console components.
//   - tools/ge/shared.mjs — the CLI colorizer (statusText/ICON) resolves each
//     status to this table's `ansi` name and renders it via picocolors.
//
// Terminals speak 16-color ANSI, not hex, so each entry carries BOTH the hex
// pair the console renders and the nearest ANSI name the CLI renders. The
// ANSI approximation is deliberately coarser: blue-means-live collapses to
// cyan (queued/running/repairing all read as "in motion" at a glance in a
// TTY), and blocked shares failed's red because a 16-color terminal has no
// orange. Changing an `ansi` value changes CLI output bytes — treat that as
// an interface change, not a refactor.
//
// `cssValue` overrides the emitted CSS value where the ramp deliberately
// aliases a chrome-palette token (`running` IS --color-primary, `passed` IS
// --color-tertiary — one blue, one green, one meaning); `hex` stays the
// resolved color so JS consumers (diagrams, chart themes) never have to parse
// a var() reference.
export const STATUS_RAMP = {
  queued: { hex: "#6b7280", ink: "#454c59", ansi: "cyan" },
  running: { hex: "#2953ff", ink: "#1d3fc7", ansi: "cyan", cssValue: "var(--color-primary)" },
  passed: { hex: "#16874a", ink: "#0d6d3a", ansi: "green", cssValue: "var(--color-tertiary)" },
  failed: { hex: "#dc3626", ink: "#9a1f14", ansi: "red" },
  blocked: { hex: "#d9660a", ink: "#8f4207", ansi: "red" },
  warning: { hex: "#ca9a08", ink: "#7a5e05", ansi: "yellow" },
  repairing: { hex: "#0f8f8a", ink: "#0a5f5b", ansi: "cyan" },
};

// Not a run status: flags AI-assisted content (the "bring your own system"
// flow). Kept beside the ramp so every semantic hue lives in one file, but
// deliberately visually distinct from run state.
export const STATUS_ACCENTS = {
  synthesized: { hex: "#7c4fe0", ink: "#5a34a8" },
};

// Loose operator vocabulary → ramp tone. This is the CLI-side normalization
// (ledger/daemon/doctor emit these spellings); the console's own permissive
// mapping lives in packages/ui/src/status.ts (toneOf) over the same seven
// tones. Unknown statuses resolve to "warning" — visible, not alarming.
export const STATUS_TONE_ALIASES = {
  done: "passed",
  pass: "passed",
  passed: "passed",
  repaired: "passed",
  running: "running",
  queued: "queued",
  doctor_running: "running",
  repairing: "repairing",
  failed: "failed",
  fail: "failed",
  blocked: "blocked",
  warn: "warning",
  warning: "warning",
};

export function statusTone(status) {
  return STATUS_TONE_ALIASES[String(status || "").toLowerCase()] || "warning";
}

// The picocolors function name for a status (the CLI colorizer's lookup).
// NB: statusTone collapses queued→its own tone but the CLI historically
// paints queued cyan ("in motion"); that identity is encoded in the ramp's
// ansi column, so this helper is a pure table lookup — no branching to drift.
export function statusAnsi(status) {
  return STATUS_RAMP[statusTone(status)].ansi;
}

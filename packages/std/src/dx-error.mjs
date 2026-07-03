// DxError — the one error contract for operator-facing failures.
//
// Every field answers the question an operator actually asks, in order:
//   what   — what failed, one sentence (doubles as Error.message, so every
//            existing "✗ <message>" renderer keeps working unchanged)
//   where  — the thing that failed: a config key, a file, a stage, a service
//   why    — the reason, in cause terms, not implementation terms
//   fix    — a literal command string to run next (or an exact edit to make);
//            Elm's rule: an error without a suggestion is a bug, so `fix` is
//            required here — if you can't name a fix, you haven't understood
//            the failure well enough to throw it at an operator yet
//
// Renderers:
//   - tools/ge/shared.mjs guarded() prints all four fields on stderr and, for
//     --json callers, emits { ok:false, error:{what,where,why,fix} } on
//     stdout — structure where there used to be silence.
//   - Plain `Error`s (message-only) render exactly as before; DxError is a
//     strict superset, never a rewrite of existing output.
//
// Compatibility: `hint` (the pre-existing machine-attached recovery field the
// renderer prints as "next: …") is aliased to `fix` so any older code that
// reads err.hint keeps working.
export class DxError extends Error {
  constructor(what, { where, why, fix, cause } = {}) {
    super(what, cause ? { cause } : undefined);
    this.name = "DxError";
    this.what = what;
    this.where = where || null;
    this.why = why || null;
    this.fix = fix || null;
    if (fix) this.hint = fix;
  }
}

export function dxError(what, fields) {
  return new DxError(what, fields);
}

export function isDxError(error) {
  return error instanceof DxError || (!!error && typeof error === "object" && typeof error.what === "string" && typeof error.fix === "string" && "why" in error);
}

// The wire shape for --json/MCP surfaces (and the unit-test contract).
export function dxErrorShape(error) {
  return {
    what: error.what || error.message || String(error),
    where: error.where || null,
    why: error.why || null,
    fix: error.fix || error.hint || null,
  };
}

// Live-layer error registry — stable GELIVE codes over the repo's one error
// contract (tools/lib/errors/dx-error.mjs). Every live failure an operator can
// hit has a registered code so CLI output, --json payloads, transcripts, and
// gate verdicts all name the same failure the same way.
//
// A live error is a DxError plus two live-specific fields:
//   code      — stable "GELIVE###" identifier (never renumbered, shrink-never)
//   retryable — whether re-running the same command can plausibly succeed
//               without an operator change (transport blips: yes; missing
//               config: no)
import { DxError } from "../errors/dx-error.mjs";

// The registry. `what` here is the generic headline; call sites may override
// it with a more specific sentence but must keep the code's meaning.
export const LIVE_ERROR_CODES = {
  GELIVE001: { what: "no shipped live target found", retryable: false },
  GELIVE002: { what: "application default credentials unavailable", retryable: false },
  GELIVE003: { what: "live assist call was denied", retryable: false },
  GELIVE004: { what: "live stream could not be parsed", retryable: true },
  GELIVE005: { what: "session threading failed across turns", retryable: true },
  GELIVE006: { what: "responder identity mismatched the expected agent", retryable: false },
  GELIVE007: { what: "live targeting is unsupported for this engine", retryable: false },
  GELIVE008: { what: "a live budget was exceeded", retryable: false },
};

export class LiveError extends DxError {
  constructor(code, what, { where, why, fix, retryable, cause } = {}) {
    const def = LIVE_ERROR_CODES[code];
    if (!def) throw new Error(`unregistered live error code: ${code}`);
    super(what || def.what, { where, why, fix, cause });
    this.name = "LiveError";
    this.code = code;
    this.retryable = retryable ?? def.retryable;
  }
}

export function liveError(code, what, fields = {}) {
  return new LiveError(code, what, fields);
}

export function isLiveError(error) {
  return error instanceof LiveError || (!!error && typeof error === "object" && typeof error.code === "string" && error.code.startsWith("GELIVE"));
}

// The wire shape carried inside transcripts / proof results / gate verdicts.
export function liveErrorShape(error) {
  return {
    code: isLiveError(error) ? error.code : null,
    what: error?.what || error?.message || String(error),
    where: error?.where || null,
    why: error?.why || null,
    fix: error?.fix || error?.hint || null,
    retryable: typeof error?.retryable === "boolean" ? error.retryable : false,
  };
}

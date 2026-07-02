// Raw log tailing transport. Verbatim move from transport.mjs.

import * as core from "../../../../../tools/lib/factory-core.mjs";
import { makeSseWriter } from "./sse.mjs";

// Poll-based NDJSON log stream: re-read tailLog, emit only new lines. writeSSE(line) sends one SSE "data:" frame.
// Each frame carries a monotonic `id:` (the line's 1-based index) so a browser
// EventSource can resume from Last-Event-ID after a drop, plus a one-time `retry:`.
export function streamLogs({ runId, stage, item, query }, writeSSE, isClosed) {
  const emit = makeSseWriter(writeSSE);
  let sent = 0;
  const tick = () => {
    if (isClosed()) return;
    let r; try { r = core.tailLog(core.loadConfig(query || {}), { runId, stage, item }); } catch { r = { ndjson: "" }; }
    const lines = (r.ndjson || "").split("\n").filter(Boolean);
    for (let i = sent; i < lines.length; i++) emit(lines[i], { seq: i + 1 });
    sent = Math.max(sent, lines.length);
    if (!isClosed()) setTimeout(tick, 1000);
  };
  tick();
}

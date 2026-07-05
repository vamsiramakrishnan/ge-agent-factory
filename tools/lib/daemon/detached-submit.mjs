// tools/lib/daemon/detached-submit.mjs — the "close-your-laptop" core for
// long-running local builds: hand a `ge <argv>` invocation to the local
// runtime daemon (tools/lib/daemon/client.mjs) and return the run id +
// follow-up commands instead of blocking the caller's terminal until the
// build finishes.
//
// Detach without a daemon is a deliberate error, not a silent in-process
// fallback: the whole point of --detach is "the daemon holds this after my
// terminal closes" — running it in-process instead would close-your-laptop
// exactly nothing, and fail the user's actual intent quietly. If the first
// submit attempt can't reach the daemon (DaemonConnectionError), this module
// runs `ensureDaemon` once (default: the same idempotent core `ge daemon
// start` uses — tools/lib/daemon/ensure-running.mjs) and retries exactly
// once; a second connection failure surfaces as a DxError naming the fix.
//
// Pure return/throw, no console/apps imports (AGENTS.md convention) — the
// caller (tools/ge/agents.mjs's `ge agents build --local --detach`) owns all
// rendering.
import { createDaemonClient, DaemonConnectionError } from "./client.mjs";
import { ensureDaemonRunning } from "./ensure-running.mjs";
import { DxError } from "../errors/dx-error.mjs";

const DETACH_FLAG = "--detach";
const DEFAULT_PORT = 17654; // matches client.mjs's DEFAULT_PORT / daemonPaths().defaultPort

function requireArgv(argv) {
  const safeArgv = Array.isArray(argv) ? argv.map(String).filter(Boolean) : [];
  if (!safeArgv.length) {
    throw new DxError("submitDetached: argv is required", {
      where: "submitDetached({ argv })",
      why: "nothing to submit to the daemon",
      fix: "pass the CLI argv to resubmit, e.g. [\"agents\", \"build\", \"--local\"]",
    });
  }
  if (safeArgv.includes(DETACH_FLAG)) {
    // Defense in depth: the caller (agents.mjs) is expected to build this
    // argv from parsed flags rather than filtering raw process.argv, which
    // already keeps --detach out — but if it ever slipped through, submitting
    // it would hand the daemon-spawned `ge` a copy of the very flag that got
    // it here, and it would try to detach itself again inside the daemon it's
    // already running inside.
    throw new DxError(`submitDetached: argv must not include ${DETACH_FLAG}`, {
      where: "submitDetached({ argv })",
      why: "the daemon spawns `node tools/ge.mjs <argv>` verbatim — a re-included --detach would recurse into another detached submission instead of running the build",
      fix: `strip ${DETACH_FLAG} from argv before calling submitDetached`,
    });
  }
  return safeArgv;
}

// Resolve one baseUrl every caller in this module agrees on, so the client
// and the default ensureDaemon target the same daemon even when neither
// `baseUrl` nor an injected `client`/`ensureDaemon` is given.
function resolveBaseUrl(baseUrl) {
  if (baseUrl) return baseUrl;
  const port = Number(process.env.GE_DAEMON_PORT) || DEFAULT_PORT;
  return `http://127.0.0.1:${port}`;
}

// submitDetached({ argv, command?, client?, ensureDaemon?, baseUrl? }) -> { runId, statusHint, followHint }
//
//   argv         the CLI argv to resubmit, WITHOUT --detach (throws if present).
//   command      optional command metadata passed through to the daemon's
//                ge.command task (mirrors client.submitTask's own `command`
//                field — round-tripped into the run's stored input, same as
//                `ge runs job`/console submissions already do).
//   client       injectable daemon client (default: createDaemonClient({ baseUrl })).
//   ensureDaemon injectable "make the daemon come up" step (default: binds
//                tools/lib/daemon/ensure-running.mjs's ensureDaemonRunning,
//                the same core `ge daemon start` uses).
//   baseUrl      daemon origin override (default: http://127.0.0.1:<port>,
//                port from GE_DAEMON_PORT or the daemon's default 17654).
export async function submitDetached({ argv, command = null, client = null, ensureDaemon = null, baseUrl } = {}) {
  const safeArgv = requireArgv(argv);
  const resolvedBaseUrl = resolveBaseUrl(baseUrl);
  const activeClient = client || createDaemonClient({ baseUrl: resolvedBaseUrl });
  const doEnsure = ensureDaemon || (() => ensureDaemonRunning({ baseUrl: resolvedBaseUrl }));

  const attempt = () => activeClient.submitTask({ kind: "ge.command", argv: safeArgv, command });

  let run;
  try {
    run = await attempt();
  } catch (error) {
    if (!(error instanceof DaemonConnectionError)) throw error;
    await doEnsure();
    try {
      run = await attempt();
    } catch (retryError) {
      if (retryError instanceof DaemonConnectionError) {
        throw new DxError("could not reach the local GE runtime daemon to submit a detached build", {
          where: "ge agents build --local --detach",
          why: "detached mode needs the daemon running to hold the build after this terminal returns; it is still unreachable after an automatic start attempt",
          fix: "ge daemon start",
        });
      }
      throw retryError;
    }
  }

  return {
    runId: run.id,
    statusHint: `ge runs show ${run.id}`,
    followHint: `ge runs events ${run.id} --follow`,
  };
}

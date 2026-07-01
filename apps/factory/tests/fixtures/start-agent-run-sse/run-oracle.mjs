// Subprocess entry point for the startAgentRun SSE parity oracle
// (../../start-agent-run-sse-golden.test.js).
//
// Runs in its OWN process (spawned via execFileSync) rather than in-process inside the
// test file, for the same reason the other *-golden.test.js oracles under
// apps/factory/tests/ shell out to a subprocess: apps/factory/src/state-paths.js computes
// GENERATOR_DATA_ROOT / GENERATOR_WORKSPACES_ROOT once, at module-load time, from
// process.env.GE_HARNESS_DATA_ROOT. server.js and every module it transitively imports
// (db.js, projects.js, ...) import those computed constants directly, and since bun/node
// cache ES modules per-process, there is no way to get a second, differently-rooted
// GENERATOR_DATA_ROOT inside a process that has already imported server.js once (e.g.
// because an earlier test file in the same `bun test` run already imported it against the
// shared apps/factory/package.json `test` script's GE_HARNESS_DATA_ROOT). A fresh process
// with GE_HARNESS_DATA_ROOT pointed at a throwaway mkdtemp dir (set by the parent test,
// passed in via env) gives this oracle a fully isolated project store + sqlite db + run
// dir on every invocation, so the emitted run/workspace ids are reproducible.
//
// Drives POST /api/chat with agentId: "mock" — the bundled, credential-free
// apps/factory/src/mock-agent.js harness "agent" (see AGENT_DEFS in src/agents.js) — which
// is what makes this route driveable fully offline/deterministically, without gcloud/ADK/
// any live agents-cli credentials. It prints deterministic canned lines over stdout on a
// short fixed interval and exits 0; no network egress, no cloud dependency.
//
// Emits one JSON object on stdout: { projectId, runId, sse, runStatus, eventsLog,
// shimScript }. The parent test masks non-deterministic substrings (the run's uuid, the
// spawned child's pid, ISO timestamps, and this process's own mkdtemp workspace root) out
// of this blob before comparing it against the committed golden fixture.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startServer } from "../../../src/server.js";
import { GENERATOR_WORKSPACES_ROOT } from "../../../src/state-paths.js";

const WORKSPACE_NAME = "sse-oracle-workspace";
const MESSAGE = "Investigate the SSE oracle fixture and summarize which mock systems are available.";

async function main() {
  const { server, url } = await startServer({ port: 0, returnServer: true, serveWeb: false });
  try {
    const createdRes = await fetch(`${url}/api/workspaces`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: WORKSPACE_NAME }),
    });
    const created = await createdRes.json();
    const projectId = created.workspace.id;

    const chatRes = await fetch(`${url}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agentId: "mock", projectId, message: MESSAGE }),
    });
    const sse = await chatRes.text();

    const runIdMatch = sse.match(/"runId":"([^"]+)"/);
    const runId = runIdMatch ? runIdMatch[1] : null;
    if (!runId) throw new Error(`could not find runId in SSE stream:\n${sse}`);

    const runStatusRes = await fetch(`${url}/api/runs/${runId}`);
    const runStatus = await runStatusRes.json();

    const eventsLogPath = join(GENERATOR_WORKSPACES_ROOT, projectId, "runs", runId, "events.jsonl");
    const eventsLog = readFileSync(eventsLogPath, "utf8");

    const shimPath = join(GENERATOR_WORKSPACES_ROOT, projectId, ".ge-harness", "bin", "ge");
    const shimScript = readFileSync(shimPath, "utf8");

    process.stdout.write(JSON.stringify({ projectId, runId, sse, runStatus, eventsLog, shimScript }));
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);

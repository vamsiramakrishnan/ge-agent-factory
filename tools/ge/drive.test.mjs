// `ge drive` contract: footer formatting is stable, and the end-to-end CLI
// (spawned, --json, cassette replay) emits a schema-valid LiveTranscript,
// records eval cases, and explains a missing target with the position screen.
import { test, expect } from "bun:test";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fmtMs, shortSession, turnFooter } from "./drive.mjs";
import { validateTranscript } from "../lib/live/transcript.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SUCCESS = "tools/lib/live/fixtures/success.ndjson";
const MISMATCH = "tools/lib/live/fixtures/responder-mismatch.ndjson";

test("fmtMs renders sub-second as ms and beyond as seconds", () => {
  expect(fmtMs(642)).toBe("642ms");
  expect(fmtMs(2400)).toBe("2.4s");
  expect(fmtMs(null)).toBe("—");
});

test("shortSession keeps the last two path segments", () => {
  expect(shortSession("projects/p/locations/g/engines/e/sessions/abc")).toBe("…/sessions/abc");
  expect(shortSession(null)).toBe("new");
});

test("turnFooter carries the full instrumentation line", () => {
  const footer = turnFooter(
    {
      stream: { ttftMs: 642, fullResponseMs: 2400, chunks: new Array(18), maxInterChunkGapMs: 312 },
      sessionAfter: "projects/p/sessions/abc",
      invocationTools: ["a", "b"],
    },
    { assertion: "matched" },
  );
  expect(footer).toBe("ttft 642ms · full 2.4s · chunks 18 · max gap 312ms · session …/sessions/abc · responder matched · tools 2");
});

async function runGe(args, { env = {} } = {}) {
  const proc = Bun.spawn(["bun", "tools/ge.mjs", ...args], {
    cwd: REPO_ROOT,
    env: { ...process.env, GE_STATE_ROOT: env.stateRoot || mkdtempSync(join(tmpdir(), "ge-drive-state-")), ...env },
    stdout: "pipe",
    stderr: "pipe",
    stdin: "ignore",
  });
  const [stdout, stderr, exitCode] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
  return { stdout, stderr, exitCode };
}

test("ge drive --cassette --json replays and emits a valid transcript", async () => {
  const { stdout, exitCode } = await runGe(["drive", "--cassette", SUCCESS, "--target-agent", "agent-benefits", "--json"]);
  expect(exitCode).toBe(0);
  const result = JSON.parse(stdout);
  expect(result.ok).toBe(true);
  expect(result.transcript.responder.assertion).toBe("matched");
  expect(result.transcript.turns).toHaveLength(2);
  expect(validateTranscript(result.transcript).issues).toEqual([]);
}, 30000);

test("ge drive --record appends the replayed conversation as an eval case", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-drive-"));
  const evalsetPath = join(dir, "recorded.evalset.json");
  const { stdout, exitCode } = await runGe(["drive", "--cassette", SUCCESS, "--record", evalsetPath, "--record-id", "recorded-case-1", "--json"]);
  expect(exitCode).toBe(0);
  const result = JSON.parse(stdout);
  expect(result.recorded.caseId).toBe("recorded-case-1");
  const evalset = JSON.parse(readFileSync(evalsetPath, "utf8"));
  expect(evalset.evalCases).toHaveLength(1);
  expect(evalset.evalCases[0].conversation[0].userContent.parts[0].text).toContain("change my plan");
  expect(evalset.evalCases[0].conversation[0].finalResponse.parts[0].text).toContain("qualifying life event");
  expect(evalset.evalCases[0].geMetadata.source).toBe("ge drive");
}, 30000);

test("ge drive --script drives scripted turns against the cassette", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-drive-"));
  const script = join(dir, "turns.txt");
  writeFileSync(script, "# benefits conversation\nCan I change my plan after having a child?\nHow many days do I have?\n");
  const { stdout, exitCode } = await runGe(["drive", "--cassette", SUCCESS, "--script", script, "--json"]);
  expect(exitCode).toBe(0);
  const result = JSON.parse(stdout);
  expect(result.transcript.turns.map((turn) => turn.user.text)).toEqual([
    "Can I change my plan after having a child?",
    "How many days do I have?",
  ]);
}, 30000);

test("responder mismatch fails the drive with GELIVE006", async () => {
  const { stdout, exitCode } = await runGe(["drive", "--cassette", MISMATCH, "--target-agent", "agent-benefits", "--json"]);
  expect(exitCode).toBe(1);
  const result = JSON.parse(stdout);
  expect(result.ok).toBe(false);
  expect(result.transcript.verdict.blockers.map((blocker) => blocker.code)).toContain("GELIVE006");
}, 30000);

test("ge drive --turns drives inline turns (the programmatic transport)", async () => {
  const { stdout, exitCode } = await runGe(["drive", "--cassette", SUCCESS, "--turns", "Can I change my plan after having a child?\nHow many days do I have?", "--json"]);
  expect(exitCode).toBe(0);
  const result = JSON.parse(stdout);
  expect(result.transcript.turns.map((turn) => turn.user.text)).toEqual([
    "Can I change my plan after having a child?",
    "How many days do I have?",
  ]);
}, 30000);

test("the registry argv serializes body.turns so the console dispatch transports them", async () => {
  const { GE_COMMANDS } = await import("@ge/capability-registry");
  const argv = GE_COMMANDS.drive.argv({ turns: "hello\nworld" });
  expect(argv).toContain("--turns");
  expect(argv[argv.indexOf("--turns") + 1]).toBe("hello\nworld");
});

test("missing live target renders the position screen with the next command", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-drive-empty-"));
  // No script, no cassette, stdin not a TTY → the scripted path with zero
  // turns hits target resolution first; with no engine configured that is
  // the GELIVE001 position screen.
  const { stdout, exitCode } = await runGe(["drive", "--project", "ge-drive-empty-test"], {
    env: { GCP_PROJECT_ID: "", GEMINI_ENTERPRISE_APP_ID: "", GE_STATE_ROOT: dir },
  });
  expect(exitCode).toBe(1);
  expect(stdout).toContain("no live target is recorded");
  expect(stdout).toContain("next");
  expect(stdout).toContain("ge init");
}, 30000);

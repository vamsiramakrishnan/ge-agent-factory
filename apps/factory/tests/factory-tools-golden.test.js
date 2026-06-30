import { test, expect } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// PARITY ORACLE for the cmdTools / factory.mjs decomposition.
//
// cmdTools emits the app/tools.py + app/agent.py that get deployed and run. Both are
// FULLY deterministic given a manifest, so we pin them: regenerate from a committed
// real manifest (the asc-606-contract-analyzer fixture: 9 tables, 1 document, 5 tool
// intents — exercises preamble, table-query tools, document tools, contract tools, and
// the agent emitter) and assert byte-identical output against committed goldens.
//
// Any extraction that changes a single byte of the generated Python fails here. This is
// the safety net that lets the cmdTools decomposition proceed (and fan out) without a
// live agents-cli/uv environment — `factory tools` is pure offline generation.
//
// If a change INTENTIONALLY alters generated output, regenerate the goldens:
//   node apps/factory/scripts/factory.mjs tools --dir <tmp-with-fixture-manifest>
//   cp <tmp>/app/{tools,agent}.py apps/factory/tests/fixtures/tools-golden/{tools,agent}.py.golden
// and review the golden diff as part of the PR.

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(HERE, "fixtures", "tools-golden");
const FACTORY = join(HERE, "..", "scripts", "factory.mjs");

function generate() {
  const ws = mkdtempSync(join(tmpdir(), "ge-tools-golden-"));
  mkdirSync(join(ws, "fixtures"), { recursive: true });
  mkdirSync(join(ws, "mock_systems"), { recursive: true });
  copyFileSync(join(FIXTURE_DIR, "manifest.json"), join(ws, "fixtures", "manifest.json"));
  writeFileSync(
    join(ws, "mock_systems", "pipeline.json"),
    JSON.stringify({
      name: "asc606",
      domain: "finance",
      steps: { init: { status: "done" }, schema: { status: "done" }, generate: { status: "done" } },
      currentStep: "generate",
    }),
  );
  execFileSync("node", [FACTORY, "tools", "--dir", ws], { stdio: "ignore" });
  const out = {
    toolsPy: readFileSync(join(ws, "app", "tools.py"), "utf8"),
    agentPy: readFileSync(join(ws, "app", "agent.py"), "utf8"),
  };
  rmSync(ws, { recursive: true, force: true });
  return out;
}

test("cmdTools generates byte-identical tools.py (parity oracle)", () => {
  const { toolsPy } = generate();
  const golden = readFileSync(join(FIXTURE_DIR, "tools.py.golden"), "utf8");
  expect(toolsPy).toBe(golden);
});

test("cmdTools generates byte-identical agent.py (parity oracle)", () => {
  const { agentPy } = generate();
  const golden = readFileSync(join(FIXTURE_DIR, "agent.py.golden"), "utf8");
  expect(agentPy).toBe(golden);
});

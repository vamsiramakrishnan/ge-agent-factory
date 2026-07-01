import { test, expect } from "bun:test";
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runGoldenOracle } from "./golden-test-helpers.mjs";

// PARITY ORACLE for the cmdTools / factory.mjs decomposition.
//
// cmdTools emits the deployed app/tools.py + app/agent.py AND the eval artifacts
// (evals/golden.json + the agents-cli evalset / eval_config / optimization_config).
// All are deterministic given a manifest (golden.json also stamps the run clock, pinned
// via GE_SOURCE_DATE), so we pin every one: regenerate from a committed real manifest
// (the asc-606-contract-analyzer fixture: 9 tables, 1 document, 5 tool intents —
// exercises preamble, table-query tools, document tools, contract tools, the agent
// emitter, and the eval renderers) and assert byte-identical output against goldens.
//
// Any extraction that changes a single byte of the generated output fails here. This is
// the safety net that lets the cmdTools decomposition proceed (and fan out) without a
// live agents-cli/uv environment — `factory tools` is pure offline generation.
//
// If a change INTENTIONALLY alters generated output, regenerate the goldens (note the
// pinned clock so golden.json's generatedAt is reproducible):
//   GE_SOURCE_DATE=2026-01-01T00:00:00Z node apps/factory/scripts/factory.mjs tools --dir <tmp-with-fixture-manifest>
//   cp <tmp>/app/{tools,agent}.py apps/factory/tests/fixtures/tools-golden/{tools,agent}.py.golden
//   cp <tmp>/evals/golden.json apps/factory/tests/fixtures/tools-golden/golden.json.golden
//   cp <tmp>/tests/eval/evalsets/ge_behavior_contract.evalset.json apps/factory/tests/fixtures/tools-golden/evalset.json.golden
//   cp <tmp>/tests/eval/{eval_config,optimization_config}.json apps/factory/tests/fixtures/tools-golden/
//   cp <tmp>/pyproject.toml apps/factory/tests/fixtures/tools-golden/pyproject.toml.golden
//   cp <tmp>/agents-cli-manifest.yaml apps/factory/tests/fixtures/tools-golden/agents-cli-manifest.yaml.golden
//   cp <tmp>/.agent_engine_config.json apps/factory/tests/fixtures/tools-golden/agent_engine_config.json.golden
// and review the golden diff as part of the PR.

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = join(HERE, "fixtures", "tools-golden");
const FACTORY = join(HERE, "..", "scripts", "factory.mjs");

function generate() {
  return runGoldenOracle({
    tmpPrefix: "ge-tools-golden-",
    setupFixture(ws) {
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
    },
    command: "node",
    args: (ws) => [FACTORY, "tools", "--dir", ws],
    // Pin the run clock so the timestamped eval artifact (golden.json) is byte-reproducible.
    env: () => ({ ...process.env, GE_SOURCE_DATE: "2026-01-01T00:00:00Z" }),
    snapshot: (ws) => ({
      toolsPy: readFileSync(join(ws, "app", "tools.py"), "utf8"),
      agentPy: readFileSync(join(ws, "app", "agent.py"), "utf8"),
      goldenEvals: readFileSync(join(ws, "evals", "golden.json"), "utf8"),
      evalSet: readFileSync(join(ws, "tests", "eval", "evalsets", "ge_behavior_contract.evalset.json"), "utf8"),
      evalConfig: readFileSync(join(ws, "tests", "eval", "eval_config.json"), "utf8"),
      optimizationConfig: readFileSync(join(ws, "tests", "eval", "optimization_config.json"), "utf8"),
      pyproject: readFileSync(join(ws, "pyproject.toml"), "utf8"),
      agentsCliManifest: readFileSync(join(ws, "agents-cli-manifest.yaml"), "utf8"),
      agentEngineConfig: readFileSync(join(ws, ".agent_engine_config.json"), "utf8"),
    }),
  });
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

// The eval artifacts (golden.json + the agents-cli evalset / eval_config /
// optimization_config) are deterministic JSON. Pin them too so the eval-artifact
// renderers can be refactored under the same byte-for-byte safety net as tools.py.
test.each([
  ["evals/golden.json", "goldenEvals", "golden.json.golden"],
  ["tests/eval/evalsets/ge_behavior_contract.evalset.json", "evalSet", "evalset.json.golden"],
  ["tests/eval/eval_config.json", "evalConfig", "eval_config.json.golden"],
  ["tests/eval/optimization_config.json", "optimizationConfig", "optimization_config.json.golden"],
  ["pyproject.toml", "pyproject", "pyproject.toml.golden"],
  ["agents-cli-manifest.yaml", "agentsCliManifest", "agents-cli-manifest.yaml.golden"],
  [".agent_engine_config.json", "agentEngineConfig", "agent_engine_config.json.golden"],
])("cmdTools generates byte-identical %s (parity oracle)", (_label, key, goldenFile) => {
  const out = generate();
  const golden = readFileSync(join(FIXTURE_DIR, goldenFile), "utf8");
  expect(out[key]).toBe(golden);
});

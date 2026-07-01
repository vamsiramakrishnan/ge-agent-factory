// agents-cli workspace metadata for a generated agent. Extracted from factory.mjs
// verbatim. Writes / reconciles three deploy-path files:
//
//   pyproject.toml             [project] + Agent Engine runtime deps + ruff/pytest
//                              config + [tool.agents-cli] (idempotently backfilled
//                              on existing workspaces).
//   agents-cli-manifest.yaml   the config the current agents-cli reads FIRST.
//   .agent_engine_config.json  opts the deploy into Agent Runtime agent identity.
//
// Pure I/O reconciliation — no generated-Python rendering. Behavior (and byte output)
// is identical to the former inline function.

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { shortAgentName } from "@ge/std/naming";
import { stringify as stringifyYaml } from "yaml";

// [project].dependencies for generated workspaces. Beyond the ADK basics, the
// agents-cli-scaffolded app/agent_runtime_app.py imports vertexai, google.cloud.logging,
// dotenv and pickles with cloudpickle; google-api-core backs the mcp backend path.
// Missing any of these → `agents-cli deploy` fails ModuleNotFoundError at runtime.
const RUNTIME_DEPS = [
  "google-adk",
  "pydantic>=2",
  "pytest>=8",
  "google-cloud-aiplatform[agent-engines]>=1.95",
  "google-cloud-logging>=3",
  "python-dotenv>=1",
  "cloudpickle>=3",
  "google-api-core>=2",
];

export async function ensureAgentsCliPyprojectMetadata(dir, manifest, { deploymentTarget = "none" } = {}) {
  const pyprojectPath = join(dir, "pyproject.toml");
  let text = existsSync(pyprojectPath) ? await readFile(pyprojectPath, "utf8") : "";
  const freshlyGenerated = !text.trim();
  if (!text.trim()) {
    text = [
      `[project]`,
      // agents-cli (scaffold enhance / deploy) enforces a <=26-char project name;
      // shortAgentName keeps it readable + deterministic + unique within that bound.
      `name = "${shortAgentName(manifest?.id || "generated_agent")}"`,
      `version = "0.1.0"`,
      `requires-python = ">=3.11"`,
      // Agent Engine runtime deps: the agents-cli-scaffolded app/agent_runtime_app.py
      // imports vertexai (google-cloud-aiplatform[agent-engines]), google.cloud.logging,
      // dotenv, cloudpickle; google-api-core is needed by the mcp backend path.
      `dependencies = [${RUNTIME_DEPS.map((d) => `"${d}"`).join(", ")}]`,
      ``,
      `[project.optional-dependencies]`,
      `eval = ["google-adk[eval]"]`,
      `lint = ["ruff>=0.14.0"]`,
      ``,
      `[tool.pytest.ini_options]`,
      `pythonpath = ["."]`,
      `testpaths = ["tests"]`,
      ``,
      // Generated code uses one-liner if/def bodies (E701) and a mid-module import
      // for the runtime backend switch (E402); default ruff would fail the validate stage.
      `[tool.ruff.lint]`,
      `ignore = ["E701", "E402"]`,
      ``,
    ].join("\n");
  }
  // Reconcile [project].dependencies on an EXISTING pyproject so backfilled
  // workspaces also get the Agent Engine runtime deps (Fix 1, second half).
  // Skip when freshly generated — that branch already wrote RUNTIME_DEPS, and the
  // dep strings carry `[extras]` brackets that a regexp array-matcher would mangle.
  if (!freshlyGenerated) {
    // Locate the dependencies array start, then scan to its matching `]`,
    // ignoring any `[`/`]` that appear inside quoted strings (e.g. `pkg[extra]`).
    const startMatch = text.match(/(^|\n)(\s*dependencies\s*=\s*)\[/);
    if (startMatch) {
      const arrayOpen = startMatch.index + startMatch[0].length - 1; // index of '['
      let i = arrayOpen + 1;
      let depth = 1;
      let quote = "";
      while (i < text.length && depth > 0) {
        const ch = text[i];
        if (quote) {
          if (ch === quote) quote = "";
        } else if (ch === '"' || ch === "'") {
          quote = ch;
        } else if (ch === "[") depth += 1;
        else if (ch === "]") depth -= 1;
        i += 1;
      }
      if (depth === 0) {
        const arrayClose = i - 1; // index of matching ']'
        const current = text.slice(arrayOpen + 1, arrayClose);
        // Compare on the bare package name (before any version/extras spec) so we
        // don't duplicate a dep that's pinned differently in the existing file.
        const baseName = (d) => d.replace(/\[.*?\]/, "").split(/[<>=!~ ]/)[0];
        const currentBases = new Set(
          Array.from(current.matchAll(/["']([^"']+)["']/g)).map((m) => baseName(m[1])),
        );
        const missing = RUNTIME_DEPS.filter((d) => !currentBases.has(baseName(d)));
        if (missing.length) {
          const trimmed = current.replace(/\s+$/, "");
          const sep = trimmed.endsWith(",") || trimmed.trim() === "" ? "" : ",";
          const appended = `${trimmed}${sep} ${missing.map((d) => `"${d}"`).join(", ")}`;
          text = `${text.slice(0, arrayOpen + 1)}${appended}${text.slice(arrayClose)}`;
        }
      }
    }
  }
  // Generated code needs E701/E402 ignored (Fix 3). Add the ruff config if absent.
  if (!/\[tool\.ruff\.lint\]/.test(text)) {
    text += [
      ``,
      `[tool.ruff.lint]`,
      `ignore = ["E701", "E402"]`,
      ``,
    ].join("\n");
  }
  // agents-cli eval runs `uv sync --extra eval`; the project must declare the
  // extra or the validate stage fails with "Extra `eval` is not defined".
  if (!/\[project\.optional-dependencies\]/.test(text)) {
    text += [
      ``,
      `[project.optional-dependencies]`,
      `eval = ["google-adk[eval]"]`,
      `lint = ["ruff>=0.14.0"]`,
      ``,
    ].join("\n");
  } else if (!/^\s*eval\s*=/m.test(text)) {
    text = text.replace(/\[project\.optional-dependencies\]\n/, `[project.optional-dependencies]\neval = ["google-adk[eval]"]\n`);
  }
  if (/\[project\.optional-dependencies\]/.test(text) && !/^\s*lint\s*=/m.test(text)) {
    text = text.replace(/\[project\.optional-dependencies\]\n/, `[project.optional-dependencies]\nlint = ["ruff>=0.14.0"]\n`);
  }
  if (!/\[tool\.agents-cli\]/.test(text)) {
    text += [
      ``,
      `[tool.agents-cli]`,
      `agent_directory = "app"`,
      `region = "us-central1"`,
      ``,
    ].join("\n");
  } else if (!/agent_directory\s*=/.test(text.split(/\[tool\.agents-cli\]/)[1]?.split(/\n\[/)[0] || "")) {
    text = text.replace(/\[tool\.agents-cli\]\n/, `[tool.agents-cli]\nagent_directory = "app"\n`);
  }
  if (!/\[tool\.agents-cli\.create_params\]/.test(text)) {
    text += [
      ``,
      `[tool.agents-cli.create_params]`,
      `deployment_target = "${deploymentTarget}"`,
      ``,
    ].join("\n");
  } else if (/deployment_target\s*=/.test(text)) {
    text = text.replace(/deployment_target\s*=\s*"[^"]*"/, `deployment_target = "${deploymentTarget}"`);
  }
  await writeFile(pyprojectPath, text.endsWith("\n") ? text : `${text}\n`, "utf8");

  // Write agents-cli-manifest.yaml — the current agents-cli reads this FIRST and
  // only warns "Legacy configuration detected in pyproject.toml" when it has to
  // fall back to [tool.agents-cli]. The factory always targets agent_runtime.
  const projectName = shortAgentName(manifest?.id || "generated_agent");
  const target = deploymentTarget && deploymentTarget !== "none" ? deploymentTarget : "agent_runtime";
  const manifestYaml = stringifyYaml({
    name: projectName,
    agent_directory: "app",
    region: "us-central1",
    create_params: { deployment_target: target, is_a2a: false },
  });
  await writeFile(join(dir, "agents-cli-manifest.yaml"), manifestYaml, "utf8");

  // Enable Agent Runtime agent identity (Preview) at deploy. agents-cli / adk deploy
  // reads this; ADC then returns the per-agent SPIFFE token to app/tools.py at runtime.
  // Absent → the attached runtime SA carries the same roles (identical code path).
  await writeFile(join(dir, ".agent_engine_config.json"), JSON.stringify({ identity_type: "AGENT_IDENTITY" }, null, 2) + "\n", "utf8");
}

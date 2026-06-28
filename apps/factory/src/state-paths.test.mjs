import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { expect, test } from "bun:test";
import {
  GENERATOR_DATA_ROOT,
  GENERATOR_WORKSPACE_STORE,
  GENERATOR_SKILLS_MANIFEST,
} from "./state-paths.js";
import { STATE_PATHS } from "../../../tools/lib/state-paths.mjs";

test("src and tools state-path modules agree on the default .ge layout", () => {
  expect(GENERATOR_DATA_ROOT).toBe(STATE_PATHS.factory.root);
  expect(GENERATOR_WORKSPACE_STORE).toBe(STATE_PATHS.factory.workspacesJson);
  expect(GENERATOR_SKILLS_MANIFEST).toBe(STATE_PATHS.skills.manifest);
});

test("GE_STATE_ROOT moves BOTH the generator and toolchain halves together", () => {
  const root = mkdtempSync(join(tmpdir(), "ge-state-parity-"));
  try {
    // Resolve paths from this test file, not the CWD, so the probe works no
    // matter where `bun test` is invoked from.
    const srcDir = dirname(fileURLToPath(import.meta.url));
    const repoRoot = resolve(srcDir, "../../..");
    const srcAbs = resolve(srcDir, "state-paths.js");
    const toolsAbs = resolve(repoRoot, "tools/lib/state-paths.mjs");
    const probe = join(root, "probe.mjs");
    writeFileSync(
      probe,
      `import { GENERATOR_WORKSPACE_STORE } from ${JSON.stringify(srcAbs)};\n` +
        `import { STATE_PATHS } from ${JSON.stringify(toolsAbs)};\n` +
        `process.stdout.write(JSON.stringify({ src: GENERATOR_WORKSPACE_STORE, tools: STATE_PATHS.factory.workspacesJson }));\n`,
    );
    const out = execFileSync("bun", [probe], {
      encoding: "utf8",
      env: {
        ...process.env,
        GE_STATE_ROOT: root,
        GE_REPO_ROOT: repoRoot,
        GE_HARNESS_DATA_ROOT: "",
        GE_HARNESS_SKILLS_MANIFEST: "",
      },
    });
    const { src, tools } = JSON.parse(out);
    expect(src).toBe(tools);
    expect(src.startsWith(root)).toBe(true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

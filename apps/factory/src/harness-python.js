import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Resolve the Python interpreter the Antigravity harness *driver* should use
// (the process that imports `google.antigravity` and runs the agent loop).
//
// Order:
//   1. GE_HARNESS_PYTHON          — explicit override (set by `ensureLocalUv`)
//   2. <repo>/.venv/bin/python    — repo-local venv created by uv (`mise run deps`),
//                                    walking up from cwd and from this module.
//                                    This is the fix for the "airlock": instead of
//                                    `pip install --break-system-packages` into a
//                                    PEP-668 externally-managed system Python, the
//                                    SDK lives in an isolated, repo-owned venv.
//   3. python3                    — fallback (e.g. the worker container image, which
//                                    installs the SDK globally and has no .venv).
const VENV_BIN =
  process.platform === "win32" ? join("Scripts", "python.exe") : join("bin", "python");

export function venvPythonAt(root) {
  const candidate = join(root, ".venv", VENV_BIN);
  return existsSync(candidate) ? candidate : null;
}

export function resolveHarnessPython() {
  if (process.env.GE_HARNESS_PYTHON) return process.env.GE_HARNESS_PYTHON;
  const starts = [process.cwd(), dirname(fileURLToPath(import.meta.url))];
  for (let start of starts) {
    let dir = start;
    for (let i = 0; i < 8 && dir; i++) {
      const found = venvPythonAt(dir);
      if (found) return found;
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return "python3";
}

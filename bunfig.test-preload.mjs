// Loaded via [test].preload in the root bunfig.toml, for every `bun test` invocation
// whose cwd is the repo root (i.e. `bun test`, `bun test apps tools packages`, CI).
//
// Raises bun's per-test default timeout from 5000ms to 20000ms. This is the workaround
// for bunfig.toml's `[test] timeout` key not being honored by bun 1.3.11 (see the comment
// in bunfig.toml and https://github.com/oven-sh/bun/issues/7789) — `setDefaultTimeout`
// from `bun:test` is the mechanism that actually changes the default.
//
// 20000ms was chosen from measured wall-clock time of the real subprocess-spawning golden
// tests (apps/factory/tests/*-golden.test.js, apps/factory/scripts/factory-workflow.test.mjs):
// the light CLI invocations (factory.mjs tools/data-plan, plan-mock-data.mjs,
// scaffold-simulator-pack.mjs) run in ~0.15-0.5s solo and up to ~1.3s under simulated 6x
// concurrent load; 20000ms leaves over an order of magnitude of headroom for a loaded CI
// runner without masking a genuine hang. The handful of much heavier end-to-end tests in
// factory-workflow.test.mjs (which shell out to `factory.mjs from-usecase`, including a
// `uv run pytest` cycle, and measured ~4.8s solo / ~11.6s under simulated 6x load) already
// carry their own explicit `test(..., 120000)` per-test overrides, which take precedence
// over this default and are left untouched.
import { setDefaultTimeout } from "bun:test";

setDefaultTimeout(20000);

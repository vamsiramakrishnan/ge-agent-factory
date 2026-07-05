#!/usr/bin/env bun
// tools/docs-shots/capture.mjs — the docs screenshot factory.
//
// Boots a production build of the console (apps/console/dist + server.js)
// against a throwaway, deterministically-seeded state directory (see
// tools/docs-shots/seed.mjs), drives it with headless Chromium (Playwright),
// and saves PNGs to docs/assets/screenshots/. See docs/DESIGN.md's
// "Screenshots" section for the full write-up.
//
// Usage:
//   bun run docs:shots            # seed + build + capture all views
//   bun run docs:shots -- --no-build   # skip `vite build` (reuse apps/console/dist)
//
// Determinism contract (verified by running this script twice and diffing
// checksums — see docs/DESIGN.md):
//   - the seed state lives under a fixed, gitignored directory that is wiped
//     at the start of every run (no leftover state from a previous capture)
//   - every id/timestamp in the seed is a hardcoded literal (tools/docs-shots/seed.mjs)
//   - the app's own entrance animation is defeated via `prefers-reduced-motion`
//   - navigation waits for network-idle + a fixed settle delay before each shot
//   - the viewport is fixed at 1440x900 (a realistic laptop width that fits the
//     console's widest view — Pipeline's two-pane wizard — without horizontal
//     scroll, at a height that clears one full page of most views above the fold)

import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..");
const STATE_DIR = join(REPO_ROOT, ".ge-docs-shots");
const SCREENSHOT_DIR = join(REPO_ROOT, "docs", "assets", "screenshots");
const PORT = 18299;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const VIEWPORT = { width: 1440, height: 900 };
const CHROMIUM_PATH = process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/pw-browsers/chromium";

const skipBuild = process.argv.includes("--no-build");

// name → { hash, wait } — `wait` is a CSS selector unique to that view's
// settled (non-skeleton) content, so we never screenshot a loading spinner.
const VIEWS = [
  { name: "overview", hash: "#/overview", wait: "text=Recently Touched Agents" },
  { name: "pipeline", hash: "#/pipeline", wait: "text=Pipeline" },
  { name: "fleet", hash: "#/fleet", wait: "text=Fleet" },
  { name: "repair-queue", hash: "#/repair", wait: "text=Repair Queue" },
  // scope=local avoids gcloud/network checks entirely (see SCOPE_CAPTIONS in
  // Doctor.tsx) — required for byte-for-byte determinism in an offline sandbox.
  // Waits for the stream's own "complete" marker (not just the page title) so
  // the shot is never taken mid-stream.
  { name: "readiness", hash: "#/doctor?scope=local", wait: "text=Readiness check complete", settleMs: 1200 },
  // Stretch surfaces (add if the required 5 work reliably).
  { name: "agent-detail", hash: "#/agent/asc-606-contract-analyzer", wait: "text=ASC 606 Contract Analyzer", settleMs: 1200 },
  { name: "interview", hash: "#/interview", wait: "text=Interview" },
];

function log(msg) {
  console.log(`[capture] ${msg}`);
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: "inherit", ...opts });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited with ${result.status}`);
  }
}

async function waitForServer(url, timeoutMs = 30_000) {
  // Deliberately real wall-clock, not apps/factory/src/source-clock.js's sourceTimestamp():
  // this is a monotonic poll-timeout budget for a real server boot, not a timestamp written
  // into a generated/committed artifact (source-clock.js's actual determinism concern — see
  // its header comment). Routing it through sourceTimestamp() would parse an ISO string back
  // into a number for no benefit, and would be actively wrong if GE_SOURCE_DATE is ever set in
  // this process (it would freeze `deadline` at the pinned instant, making the loop expire
  // immediately) — the screenshot-determinism contract above already achieves byte-exact PNGs
  // via fixed seed data + reduced motion + a fixed viewport, not by freezing wall time.
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function main() {
  // ── 1. Isolated, deterministic seed state ───────────────────────────────
  // Never touch a real developer's .ge/ — this is a dedicated, gitignored
  // directory wiped at the start of every capture run.
  rmSync(STATE_DIR, { recursive: true, force: true });
  mkdirSync(STATE_DIR, { recursive: true });
  const jobStoreDir = join(STATE_DIR, "console", "jobs");
  const seedEnv = { ...process.env, GE_STATE_ROOT: STATE_DIR, GE_CONSOLE_JOB_STORE: jobStoreDir };

  log(`seeding deterministic state → ${STATE_DIR}`);
  run("bun", ["tools/docs-shots/seed.mjs"], { env: seedEnv });

  // ── 2. Production build (unless --no-build) ─────────────────────────────
  const distDir = join(REPO_ROOT, "apps/console/dist");
  let builtDist = false;
  if (!skipBuild || !existsSync(distDir)) {
    log("building console (vite build) …");
    run("bun", ["run", "--filter", "./apps/console", "build"]);
    builtDist = true;
  } else {
    log("reusing existing apps/console/dist (--no-build)");
  }

  // ── 3. Serve the production build against the seeded state ──────────────
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  log(`starting console server on :${PORT}`);
  const server = spawn("bun", ["server.js"], {
    cwd: join(REPO_ROOT, "apps/console"),
    env: {
      ...process.env,
      PORT: String(PORT),
      GE_STATE_ROOT: STATE_DIR,
      GE_CONSOLE_JOB_STORE: jobStoreDir,
      GE_AUTH_MODE: "", // never gate the docs-shots capture behind Firebase auth
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (d) => process.stdout.write(`[console] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[console] ${d}`));

  let browser = null;
  try {
    await waitForServer(`${BASE_URL}/api/ge/status`);
    log("console server is up");

    const { chromium } = await import("playwright");
    browser = await chromium.launch({
      executablePath: existsSync(CHROMIUM_PATH) ? CHROMIUM_PATH : undefined,
      args: ["--force-color-profile=srgb", "--font-render-hinting=none"],
    });
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
      colorScheme: "light",
      reducedMotion: "reduce",
      timezoneId: "UTC",
      locale: "en-US",
    });
    const page = await context.newPage();
    // Freeze the browser clock. Several views render wall-clock-derived text
    // (e.g. AgentDetail's "Synced <time>" from `new Date().toISOString()` at
    // fetch time) that would otherwise make two capture runs differ by a
    // timestamp even though every seeded byte is identical. Fixing `Date`/
    // `performance.now()` at a hardcoded instant — matching seed.mjs's own
    // narrative clock — closes that gap for every current and future view
    // without auditing each component for live-clock reads.
    await page.clock.setFixedTime(new Date("2026-01-15T09:20:00.000Z"));
    // A real user dismisses the first-run "Get Started" card once; seed that
    // same localStorage flag so Overview captures its steady-state layout
    // instead of the (also real, just less representative for docs) onboarding
    // banner. This is a supported product affordance, not fabricated state.
    await page.addInitScript(() => {
      try { window.localStorage.setItem("ge.getStarted.dismissed", "1"); } catch { /* best-effort */ }
    });

    for (const view of VIEWS) {
      log(`capturing ${view.name} (${view.hash}) …`);
      await page.goto(`${BASE_URL}/${view.hash}`, { waitUntil: "networkidle" });
      await page.locator(view.wait).first().waitFor({ state: "visible", timeout: 20_000 });
      // Let the 150ms enter transition (and any last layout shift) fully settle.
      await page.waitForTimeout(view.settleMs ?? 700);
      const outPath = join(SCREENSHOT_DIR, `${view.name}.png`);
      await page.screenshot({ path: outPath, animations: "disabled" });
      log(`  saved ${outPath}`);
    }

    await context.close();
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
    await new Promise((r) => setTimeout(r, 200));
    // apps/console/dist is gitignored, throwaway build output — but
    // tools/check-silent-catches.mjs globs apps/**/*.js without excluding it,
    // so leaving it around trips `bun run source:hygiene` for the next command
    // run in this working tree. Clean up what we built (never a dist the
    // caller explicitly kept via --no-build).
    if (builtDist) rmSync(distDir, { recursive: true, force: true });
  }

  log("done.");
}

main().catch((err) => {
  console.error("[capture] failed:", err);
  process.exitCode = 1;
});

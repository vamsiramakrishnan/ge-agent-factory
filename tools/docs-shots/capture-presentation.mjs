#!/usr/bin/env bun
// tools/docs-shots/capture-presentation.mjs — captures the periodic-table
// slide from apps/presentation for docs/README use. Sibling to capture.mjs
// (same Playwright conventions: fixed clock, reduced motion, disabled
// animations) but the presentation deck needs no seeded server state — its
// catalog data is static, bundled at build time — so this is a much smaller
// script than the console's.
//
// Usage:
//   bun run docs:shots                       # runs this after capture.mjs
//   bun tools/docs-shots/capture-presentation.mjs [--no-build]

import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..");
const SCREENSHOT_DIR = join(REPO_ROOT, "docs", "assets", "screenshots");
const PORT = 18298;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const VIEWPORT = { width: 1600, height: 900 };
const CHROMIUM_PATH = process.env.PLAYWRIGHT_CHROMIUM_PATH || "/opt/pw-browsers/chromium";

const skipBuild = process.argv.includes("--no-build");

function log(msg) {
  console.log(`[capture-presentation] ${msg}`);
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { cwd: REPO_ROOT, stdio: "inherit", ...opts });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited with ${result.status}`);
  }
}

async function waitForServer(url, timeoutMs = 30_000) {
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
  const distDir = join(REPO_ROOT, "apps/presentation/dist");
  let builtDist = false;
  if (!skipBuild || !existsSync(distDir)) {
    log("building presentation (vite build) …");
    run("bun", ["run", "--filter", "./apps/presentation", "build"]);
    builtDist = true;
  } else {
    log("reusing existing apps/presentation/dist (--no-build)");
  }

  mkdirSync(SCREENSHOT_DIR, { recursive: true });
  log(`starting presentation preview server on :${PORT}`);
  // Invoke the vite binary directly (not via `bun run`, which interposes an
  // extra process that was observed dying to a stray SIGTERM mid-capture,
  // taking vite down with it) — same pattern capture.mjs uses for the
  // console's server.js.
  const server = spawn(
    join(REPO_ROOT, "apps/presentation/node_modules/.bin/vite"),
    ["preview", "--port", String(PORT), "--strictPort"],
    { cwd: join(REPO_ROOT, "apps/presentation"), stdio: ["ignore", "pipe", "pipe"] },
  );
  server.stdout.on("data", (d) => process.stdout.write(`[presentation] ${d}`));
  server.stderr.on("data", (d) => process.stderr.write(`[presentation] ${d}`));

  let browser = null;
  try {
    await waitForServer(BASE_URL);
    log("presentation server is up");

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
    // No page.clock freeze here (unlike capture.mjs): the periodic table has
    // no wall-clock-derived text, and freezing time was observed to stall the
    // deck's AnimatePresence slide transition indefinitely (its completion
    // depends on a timer that a frozen clock never advances).

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(800); // let the deck finish mounting before the picker shortcut can register
    // Jump straight to the periodic table via the slide picker (`m`) instead
    // of paging through the deck — deterministic regardless of deck order.
    await page.keyboard.press("m");
    await page.locator("input").first().fill("Capability Map");
    await page.getByText("Enterprise Capability Map").first().waitFor({ state: "visible", timeout: 10_000 });
    await page.getByText("Enterprise Capability Map").first().click();
    await page.locator("text=The Periodic Table of HR Agents").first().waitFor({ state: "visible", timeout: 10_000 });
    await page.mouse.move(0, 0); // park the cursor away from any hoverable tile
    await page.waitForTimeout(500);
    // Kill remaining CSS animations/transitions (e.g. per-tile trigger-type
    // dots, aurora background blobs) *after* the slide transition has
    // already completed — added only now because doing this before the
    // transition interferes with the transition itself. Verified by running
    // this script twice and diffing checksums (see the capture notes).
    await page.addStyleTag({
      content: "*, *::before, *::after { animation: none !important; transition: none !important; }",
    });
    await page.waitForTimeout(200);

    const outPath = join(SCREENSHOT_DIR, "periodic-table.png");
    await page.screenshot({ path: outPath, animations: "disabled" });
    log(`saved ${outPath}`);
    // Known gap: this shot is not yet fully byte-identical run over run — a
    // few pixels near the top rows drift between runs even with animations
    // and transitions killed above. Most likely a requestAnimationFrame-driven
    // pulse on the per-tile status dots that CSS `animation: none` doesn't
    // reach (rAF isn't a CSS animation). Flagging rather than hiding it.

    await context.close();
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
    await new Promise((r) => setTimeout(r, 200));
    if (builtDist) rmSync(distDir, { recursive: true, force: true });
  }

  log("done.");
}

main().catch((err) => {
  console.error("[capture-presentation] failed:", err);
  process.exitCode = 1;
});

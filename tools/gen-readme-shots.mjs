#!/usr/bin/env node
// Regenerate the README's console + presentation screenshots
// (docs/assets/screenshots/*.png) with Playwright, against the console
// (apps/console) and presentation (apps/presentation) dev servers running
// locally against the repo's own local state (the `ge` runtime daemon +
// registered workspaces from `ge init` / `ge devex smoke`).
//
//   ge daemon start                          # once — the console reads this
//   node tools/gen-readme-shots.mjs          # regenerate all shots
//
// Wall-clock text ("Synced 11:20:42 PM", "4m ago") is frozen via an
// injected Date override so re-running against unchanged local state
// reproduces byte-identical PNGs — see freezeClock() below. It does NOT
// make the shots independent of local state: a clean checkout has no
// registered workspaces until you run the quickstart in SETUP.md, so the
// console/pipeline/repair views will show 0 agents instead of the
// checked-in 364-catalog / 1-workspace state. That's a known gap, not
// silently papered over — see the README mission report.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT_DIR = join(ROOT, "docs", "assets", "screenshots");
mkdirSync(OUT_DIR, { recursive: true });

const CONSOLE_BASE = process.env.GE_CONSOLE_URL || "http://localhost:18260";
const PRESENTATION_BASE = process.env.GE_PRESENTATION_URL || "http://localhost:18250";
const VIEWPORT = { width: 1440, height: 900 };
const FROZEN_NOW = "2026-07-02T23:30:00.000Z";

// Some sandboxes provide a pre-fetched browser at a nonstandard path (see
// tools/gen-readme-shots.mjs's caller in CI docs / SETUP.md); everyone else
// gets Playwright's normal managed install via `bunx playwright install
// chromium` (one-time, like the mise toolchain).
const LAUNCH_OPTS = process.env.PLAYWRIGHT_CHROMIUM_PATH
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
  : {};

// Kills CSS transitions/animations so a shot doesn't land mid-fade — the
// single largest source of non-determinism in the first draft of this
// script (verified by diffing two consecutive runs pixel-for-pixel).
const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
`;

// addInitScript (unlike addStyleTag) re-runs on every navigation within the
// page, which matters here since shootConsole() does several goto()s on one
// page instance.
async function freezeClock(page) {
  await page.addInitScript(
    ({ iso, css }) => {
      const fixed = new Date(iso).getTime();
      const OriginalDate = Date;
      class FrozenDate extends OriginalDate {
        constructor(...args) {
          if (args.length === 0) return new OriginalDate(fixed);
          return new OriginalDate(...args);
        }
        static now() {
          return fixed;
        }
      }
      // eslint-disable-next-line no-global-assign
      Date = FrozenDate;

      const inject = () => {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
      };
      if (document.head) inject();
      else document.addEventListener("DOMContentLoaded", inject);
    },
    { iso: FROZEN_NOW, css: DISABLE_ANIMATIONS_CSS },
  );
}

const CONSOLE_SHOTS = [
  { route: "overview", file: "console-overview.png" },
  { route: "pipeline", file: "console-pipeline.png" },
  { route: "repair", file: "console-repair.png" },
  { route: "agent/account-reconciliation-agent", file: "console-agent.png" },
];

async function shootConsole(browser) {
  const page = await browser.newPage({ viewport: VIEWPORT });
  await freezeClock(page);
  for (const { route, file } of CONSOLE_SHOTS) {
    await page.goto(`${CONSOLE_BASE}/#/${route}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(OUT_DIR, file) });
    console.log(`generated docs/assets/screenshots/${file}`);
  }
  await page.close();
}

async function shootPresentation(browser) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await freezeClock(page);
  await page.goto(PRESENTATION_BASE, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(800);
  await page.keyboard.press("m");
  await page.waitForTimeout(400);
  const input = await page.$("input");
  await input.fill("Capability Map");
  await page.waitForTimeout(400);
  await page.getByText("Enterprise Capability Map").first().click();
  await page.waitForTimeout(1500);
  await page.mouse.move(0, 0); // park the cursor — an inherited hover state from the click above is the one remaining source of pixel drift
  await page.waitForTimeout(200);
  await page.screenshot({ path: join(OUT_DIR, "presentation-periodic-table.png") });
  console.log("generated docs/assets/screenshots/presentation-periodic-table.png");
  // Known gap: this one shot still isn't byte-identical run over run — a few
  // pixels around the domain-count badges drift, most likely a rAF-driven
  // pulse on the per-agent status dots that CSS animation-duration:0 doesn't
  // reach. Everything else in this script verified byte-identical across
  // two consecutive runs; this is the one open item (see mission report).
  await page.close();
}

const browser = await chromium.launch(LAUNCH_OPTS);
try {
  await shootConsole(browser);
  await shootPresentation(browser);
} finally {
  await browser.close();
}

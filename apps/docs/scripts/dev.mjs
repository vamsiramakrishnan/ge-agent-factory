#!/usr/bin/env node
// Docs-site development loop. The catalog is generated once by the package
// script before this process starts. Canonical docs/ prose and assets are then
// resynced whenever they change; Astro sees the emitted MDX/public changes and
// hot-reloads them without paying the catalog-generation cost on every save.
import { watch } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const REPO = join(APP, "..", "..");
const DOCS = join(REPO, "docs");

let syncRunning = false;
let syncQueued = false;
let debounce;

function runSync() {
  if (syncRunning) {
    syncQueued = true;
    return;
  }
  syncRunning = true;
  const child = spawn(process.execPath, [join(HERE, "sync-content.mjs")], {
    cwd: REPO,
    stdio: "inherit",
  });
  child.once("exit", (code, signal) => {
    syncRunning = false;
    if (signal) console.error(`docs sync stopped by ${signal}`);
    else if (code !== 0) console.error(`docs sync failed with exit code ${code}`);
    if (syncQueued) {
      syncQueued = false;
      runSync();
    }
  });
}

function scheduleSync() {
  clearTimeout(debounce);
  debounce = setTimeout(runSync, 120);
}

// Finish the initial sync before Astro starts, so its first content scan sees
// a complete tree. Subsequent syncs are serialized by runSync().
const initial = spawn(process.execPath, [join(HERE, "sync-content.mjs")], {
  cwd: REPO,
  stdio: "inherit",
});
const initialCode = await new Promise((resolve) => initial.once("exit", resolve));
if (initialCode !== 0) process.exit(initialCode ?? 1);

const docsWatcher = watch(DOCS, { recursive: true }, (_event, filename) => {
  if (!filename) return scheduleSync();
  if (/\.(?:md|svg|png|jpe?g|gif|webp)$/i.test(String(filename))) scheduleSync();
});

const astro = spawn("astro", ["dev", ...process.argv.slice(2)], {
  cwd: APP,
  stdio: "inherit",
  shell: process.platform === "win32",
});

function stop(signal) {
  docsWatcher.close();
  clearTimeout(debounce);
  if (!astro.killed) astro.kill(signal);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => stop(signal));
}

astro.once("exit", (code, signal) => {
  docsWatcher.close();
  clearTimeout(debounce);
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});

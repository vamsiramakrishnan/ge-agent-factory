import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
  writeSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

export function readJson(path, fallback = null) {
  if (!path || !existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

// A temp-file counter that, with the pid, makes temp names unique without
// Math.random (keeps generation deterministic and avoids collisions).
let tmpSeq = 0;

/**
 * Atomic JSON write: serialize to a sibling temp file, fsync, then rename over
 * the target. rename(2) is atomic on a single filesystem, so a crash or full
 * disk mid-write can never leave a truncated/half-written state file — readers
 * see either the old bytes or the new bytes, never garbage.
 */
export function writeJson(path, value, { mode } = {}) {
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true });
  const data = JSON.stringify(value, null, 2) + "\n";
  const tmp = join(dir, `.${basename(path)}.${process.pid}.${tmpSeq++}.tmp`);
  const fd = mode === undefined ? openSync(tmp, "w") : openSync(tmp, "w", mode);
  try {
    writeSync(fd, data, null, "utf8");
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  try {
    renameSync(tmp, path);
  } catch (error) {
    try {
      unlinkSync(tmp);
    } catch {
      /* best-effort cleanup */
    }
    throw error;
  }
}

// Per-path in-process serialization. Within a single process JS is single
// threaded, but an async read-modify-write can still interleave across awaits
// and lose updates; this promise chain forces them to run one at a time.
const pathChains = new Map();

function withPathChain(path, fn) {
  const prev = pathChains.get(path) ?? Promise.resolve();
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const tail = prev.then(() => gate);
  pathChains.set(path, tail);
  return prev
    .catch(() => {})
    .then(fn)
    .finally(() => {
      release();
      if (pathChains.get(path) === tail) pathChains.delete(path);
    });
}

// Cross-process advisory lock via an O_EXCL lockfile. The in-process chain above
// guarantees no same-process contention, so under normal single-process use this
// acquires immediately. Stale locks (from a crashed process) are reclaimed after
// staleMs. The brief sync spin only runs under genuine multi-process contention.
function acquireFileLock(path, { timeoutMs = 5000, staleMs = 30000 } = {}) {
  const lockPath = `${path}.lock`;
  mkdirSync(dirname(path), { recursive: true });
  const start = Date.now();
  for (;;) {
    try {
      const fd = openSync(lockPath, "wx");
      try {
        writeSync(fd, String(process.pid));
      } finally {
        closeSync(fd);
      }
      return lockPath;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      try {
        if (Date.now() - statSync(lockPath).mtimeMs > staleMs) {
          unlinkSync(lockPath);
          continue;
        }
      } catch {
        continue;
      }
      if (Date.now() - start > timeoutMs) {
        throw new Error(`json-io: timed out acquiring lock ${lockPath}`);
      }
      const until = Date.now() + 10;
      while (Date.now() < until) {
        /* short spin; only reached under cross-process contention */
      }
    }
  }
}

function releaseFileLock(lockPath) {
  try {
    unlinkSync(lockPath);
  } catch {
    /* already gone */
  }
}

/**
 * Atomic read-modify-write of a JSON file. The updater receives the current
 * value (or `fallback` if the file is missing/corrupt) and returns the next
 * value, which is written atomically. Concurrent callers — in this process or
 * another — are serialized so updates are never lost.
 */
export async function updateJson(path, updater, { fallback = null, mode } = {}) {
  return withPathChain(path, async () => {
    const lock = acquireFileLock(path);
    try {
      const current = readJson(path, fallback);
      const next = await updater(current);
      writeJson(path, next, { mode });
      return next;
    } finally {
      releaseFileLock(lock);
    }
  });
}

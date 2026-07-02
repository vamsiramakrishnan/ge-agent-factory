// Tests for guarded() in tools/ge/shared.mjs — the ge CLI's error boundary —
// covering the stable-error-code rendering added in next-horizon B4.
//
// Byte-identity contract: an error WITHOUT a registered GE#### code must
// render exactly what guarded() always rendered: pc.red(`✗ ${message}`) + "\n"
// on stderr and process.exitCode = 1, nothing else. The expected strings below
// are built with the same picocolors calls the pre-B4 implementation used, so
// the comparison is byte-exact whether or not colors are enabled in this
// environment.
import { describe, expect, test } from "bun:test";
import pc from "picocolors";
import { guarded } from "./shared.mjs";
import {
  DOCS_SITE_BASE_URL,
  ERROR_CODES,
} from "../../apps/factory/scripts/factory/core/error-codes.mjs";
import { fail } from "../../apps/factory/scripts/factory/core/pipeline.mjs";

async function runGuarded(run) {
  const writes = [];
  const origWrite = process.stderr.write;
  const origExit = process.exitCode;
  process.stderr.write = (chunk) => {
    writes.push(String(chunk));
    return true;
  };
  let returned;
  try {
    // Bun ignores `process.exitCode = undefined`; 0 is the reliable reset.
    process.exitCode = 0;
    returned = await guarded(run)({});
  } finally {
    process.stderr.write = origWrite;
  }
  const exitCode = process.exitCode;
  process.exitCode = origExit;
  return { writes, exitCode, returned };
}

const throwing = (error) => () => {
  throw error;
};

describe("guarded() — uncoded errors stay byte-identical to the pre-B4 boundary", () => {
  test("plain Error: exactly one red ✗ line, exitCode 1", async () => {
    const { writes, exitCode } = await runGuarded(throwing(new Error("daemon request failed: boom")));
    expect(writes).toEqual([pc.red("✗ daemon request failed: boom") + "\n"]);
    expect(exitCode).toBe(1);
  });

  test("a Node system code (ENOENT) is not a registered code — no decoration", async () => {
    const e = new Error("ENOENT: no such file or directory");
    e.code = "ENOENT";
    const { writes } = await runGuarded(throwing(e));
    expect(writes).toEqual([pc.red("✗ ENOENT: no such file or directory") + "\n"]);
  });

  test("non-Error thrown value keeps the legacy `✗ <value>` shape", async () => {
    const { writes, exitCode } = await runGuarded(throwing("string failure"));
    expect(writes).toEqual([pc.red("✗ string failure") + "\n"]);
    expect(exitCode).toBe(1);
  });
});

describe("guarded() — registered GE#### codes decorate the failure", () => {
  test("✗ GE#### <message> plus a dim docs-site deep link, exitCode 1", async () => {
    let coded;
    try {
      fail("Deploy failed: build timed out", "GE0009");
    } catch (e) {
      coded = e;
    }
    const { writes, exitCode } = await runGuarded(throwing(coded));
    expect(writes).toEqual([
      pc.red("✗ GE0009 Deploy failed: build timed out") + "\n",
      pc.dim(`→ ${DOCS_SITE_BASE_URL}${ERROR_CODES.GE0009.docsAnchor}`) + "\n",
    ]);
    expect(exitCode).toBe(1);
  });

  test("an unregistered GE code is treated as uncoded (typo safety)", async () => {
    const e = new Error("mystery");
    e.code = "GE9999";
    const { writes } = await runGuarded(throwing(e));
    expect(writes).toEqual([pc.red("✗ mystery") + "\n"]);
  });
});

describe("guarded() — success path untouched", () => {
  test("returns the run()'s value, writes nothing, does not flag failure", async () => {
    const { writes, exitCode, returned } = await runGuarded(async () => "ok-value");
    expect(returned).toBe("ok-value");
    expect(writes).toEqual([]);
    // Success must not leave the failure exit code behind (reset to 0 by the
    // harness above; guarded() only ever sets 1 on the catch path).
    expect(exitCode).toBe(0);
  });
});

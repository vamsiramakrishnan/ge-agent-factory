import { describe, expect, test } from "bun:test";
import { execFileCapture, execFileSyncCapture, spawnCapture, spawnSyncCapture } from "./subprocess.mjs";

describe("runtime-neutral subprocess capture", () => {
  test("captures stdout and stderr from a successful child", () => {
    const result = spawnSyncCapture(process.execPath, ["-e", "console.log('out'); console.error('err')"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe("out\n");
    expect(result.stderr).toBe("err\n");
  });

  test("preserves failed-child diagnostics", () => {
    const result = spawnSyncCapture(process.execPath, ["-e", "console.error('broken'); process.exit(3)"]);
    expect(result.status).toBe(3);
    expect(result.stderr).toContain("broken");
    expect(() => execFileSyncCapture(process.execPath, ["-e", "console.error('broken'); process.exit(3)"]))
      .toThrow(/broken/);
  });

  test("captures an asynchronous child without blocking the caller", async () => {
    const result = await spawnCapture(process.execPath, ["-e", "console.log('async out'); console.error('async err')"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe("async out\n");
    expect(result.stderr).toBe("async err\n");
  });

  test("throws asynchronous failed-child diagnostics", async () => {
    await expect(execFileCapture(process.execPath, ["-e", "console.error('async broken'); process.exit(4)"]))
      .rejects.toThrow(/async broken/);
  });
});

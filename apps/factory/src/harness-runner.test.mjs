import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { __test } from "./harness-runner.js";

describe("harness runner config", () => {
  test("resolves Vertex project from nearest parent .ge.json", () => {
    const defaults = __test.resolveVertexDefaults({
      repoRoot: resolve("apps/factory"),
      project: null,
      location: null,
      vertex: true,
    });

    expect(defaults.project).toBeTruthy();
    expect(defaults.location).toBe("global");
  });

  test("buffers split Antigravity status lines before parsing", () => {
    const lines = __test.createLineBuffer();
    const first = lines.push('{"type":"antigravity.text_delta",');
    const second = lines.push('"preview":"hello"}\n');
    expect(first).toEqual([]);
    expect(second).toEqual(['{"type":"antigravity.text_delta","preview":"hello"}']);

    const parsed = __test.parseAntigravityStatusLines(`${second[0]}\n`);
    expect(parsed.events[0].type).toBe("antigravity.text_delta");
    expect(parsed.events[0].preview).toBe("hello");
  });
});

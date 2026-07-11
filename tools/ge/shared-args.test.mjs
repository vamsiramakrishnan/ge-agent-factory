import { describe, expect, test } from "bun:test";
import { argFlag, argValue } from "./shared.mjs";

describe("CLI arg helpers", () => {
  test("read citty camelCase and explicit kebab-case flag shapes", () => {
    expect(argFlag({ noProxy: true }, "no-proxy")).toBe(true);
    expect(argFlag({ "no-proxy": true }, "no-proxy")).toBe(true);
    expect(argFlag({ proxy: false }, "no-proxy")).toBe(true);
    expect(argValue({ maxOutputTokens: "4096" }, "max-output-tokens")).toBe("4096");
    expect(argValue({ "max-output-tokens": "8192" }, "max-output-tokens")).toBe("8192");
  });
});

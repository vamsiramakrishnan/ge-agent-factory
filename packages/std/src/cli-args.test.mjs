import { expect, test } from "bun:test";
import { boolFlag, parseCommandArgs, parseFlagArgs } from "./cli-args.mjs";

test("parseFlagArgs returns positional values and flags", () => {
  expect(parseFlagArgs(["cmd", "--id", "x", "--force"], { bareValue: "true" })).toEqual({
    positional: ["cmd"],
    flags: { id: "x", force: "true" },
  });
});

test("parseCommandArgs returns command and flags", () => {
  expect(parseCommandArgs(["schema", "--dir", "x"], "help", { bareValue: "true" })).toEqual({
    command: "schema",
    flags: { dir: "x" },
  });
});

test("parseCommandArgs falls back to default command", () => {
  expect(parseCommandArgs(["--dir", "x"], "help", { bareValue: "true" })).toEqual({
    command: "help",
    flags: { dir: "x" },
  });
});

test("boolFlag handles common false and true values", () => {
  expect(boolFlag({ enabled: "false" }, "enabled", true)).toBe(false);
  expect(boolFlag({ enabled: "0" }, "enabled", true)).toBe(false);
  expect(boolFlag({ enabled: "true" }, "enabled", false)).toBe(true);
  expect(boolFlag({ enabled: true }, "enabled", false)).toBe(true);
  expect(boolFlag({ enabled: false }, "enabled", true)).toBe(false);
  expect(boolFlag({}, "enabled", true)).toBe(true);
});

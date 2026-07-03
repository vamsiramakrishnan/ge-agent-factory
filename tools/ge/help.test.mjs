// CS-3 contract: root --help groups (Golden path first) and HIDES NOTHING —
// every subcommand in the citty tree must render in the grouped usage.
import { test, expect } from "bun:test";
import { renderRootUsage, renderGoldenPathSection, GOLDEN_PATH_COMMANDS } from "./help.mjs";
import { rootCommand } from "../ge.mjs";

const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");

test("golden path renders first: capture, prove, handoff, status", () => {
  const usage = strip(renderRootUsage(rootCommand));
  const goldenIdx = usage.indexOf("Golden path");
  const operateIdx = usage.indexOf("Operate");
  expect(goldenIdx).toBeGreaterThan(-1);
  expect(operateIdx).toBeGreaterThan(goldenIdx);
  for (const name of GOLDEN_PATH_COMMANDS) {
    const idx = usage.indexOf(`\n  ${name}`);
    expect(idx).toBeGreaterThan(goldenIdx);
    expect(idx).toBeLessThan(operateIdx);
  }
});

test("every subcommand in the tree renders — grouping never drops a command", () => {
  const usage = strip(renderRootUsage(rootCommand));
  for (const name of Object.keys(rootCommand.subCommands)) {
    expect(usage).toContain(`\n  ${name.padEnd(2)}`);
  }
});

test("the golden path section renders exactly the four verbs", () => {
  const section = strip(renderGoldenPathSection(rootCommand, { colors: false }));
  const names = section.split("\n").map((l) => l.trim().split(/\s+/)[0]).filter(Boolean);
  expect(names).toEqual(["capture", "prove", "handoff", "status"]);
});

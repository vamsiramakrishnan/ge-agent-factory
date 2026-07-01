// Pure-logic tests for `ge init`'s interactive project-resolution gating.
// core.init()'s discovery order (terraform outputs → single active gcloud
// config) never yields multiple candidates — the one failure mode it has is
// "no project found at all". shouldPromptForInitProject decides whether that
// specific failure should trigger an interactive prompt instead of the
// existing hard failure. The actual prompt() call site (promptForInitProject
// in tools/ge.mjs) touches @clack/prompts and is exercised once the
// dependency is added during integration.
import { describe, expect, test } from "bun:test";
import { __test } from "./ge.mjs";

const { shouldPromptForInitProject, GE_INIT_NO_PROJECT_MESSAGE } = __test;

const noProjectError = () => new Error(GE_INIT_NO_PROJECT_MESSAGE);

describe("shouldPromptForInitProject", () => {
  test("never prompts when not a real TTY, even for the no-project error", () => {
    expect(shouldPromptForInitProject(noProjectError(), {}, { isTTY: false })).toBe(false);
  });

  test("never prompts when --json was requested (machine callers must not block)", () => {
    expect(shouldPromptForInitProject(noProjectError(), { json: true }, { isTTY: true })).toBe(false);
  });

  test("never prompts when --project was already passed explicitly", () => {
    expect(shouldPromptForInitProject(noProjectError(), { project: "already-set" }, { isTTY: true })).toBe(false);
  });

  test("prompts at a TTY for exactly the no-project failure with no --project/--json", () => {
    expect(shouldPromptForInitProject(noProjectError(), {}, { isTTY: true })).toBe(true);
  });

  test("never prompts for a different error message (e.g. gcloud missing) — only the exact no-project case", () => {
    const otherError = new Error("gcloud not found on PATH. Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install");
    expect(shouldPromptForInitProject(otherError, {}, { isTTY: true })).toBe(false);
  });

  test("never prompts when there is no error at all", () => {
    expect(shouldPromptForInitProject(null, {}, { isTTY: true })).toBe(false);
  });

  test("defaults to checking real stdout/stdin TTY state when no override given", () => {
    // In this (non-interactive) test runner, process.stdin/stdout are not TTYs,
    // so the default detection must resolve to "don't prompt" even for the
    // exact no-project error — matching CI/piped/scripted invocations.
    expect(shouldPromptForInitProject(noProjectError(), {})).toBe(false);
  });
});

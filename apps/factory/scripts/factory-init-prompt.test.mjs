// Pure-logic tests for `factory init`'s interactive-prompt gating/fallback
// behavior. These exercise ONLY the pieces that don't touch @clack/prompts —
// "should we prompt at all" and "what's provided vs missing" — so they run
// without the dependency installed. The actual prompt() call sites
// (promptForMissingInit) are exercised once @clack/prompts is added during
// integration; see tools/ge.mjs team notes for the same split.
import { describe, expect, test } from "bun:test";
import { __test } from "./factory.mjs";

const { shouldPromptForInit, resolveInitPromptPlan, INIT_DOMAIN_CHOICES } = __test;

describe("shouldPromptForInit", () => {
  test("never prompts when not a real TTY, even with nothing supplied", () => {
    expect(shouldPromptForInit({}, { isTTY: false })).toBe(false);
  });

  test("never prompts when --yes is passed, even at a TTY with nothing else supplied", () => {
    expect(shouldPromptForInit({ yes: true }, { isTTY: true })).toBe(false);
  });

  test("never prompts when --non-interactive is passed", () => {
    expect(shouldPromptForInit({ "non-interactive": true }, { isTTY: true })).toBe(false);
  });

  test("prompts at a TTY when both name and domain are missing", () => {
    expect(shouldPromptForInit({}, { isTTY: true })).toBe(true);
  });

  test("prompts at a TTY when only name is missing", () => {
    expect(shouldPromptForInit({ domain: "hr" }, { isTTY: true })).toBe(true);
  });

  test("prompts at a TTY when only domain is missing", () => {
    expect(shouldPromptForInit({ name: "demo" }, { isTTY: true })).toBe(true);
  });

  test("never prompts when both name and domain are already supplied, even at a TTY", () => {
    expect(shouldPromptForInit({ name: "demo", domain: "hr" }, { isTTY: true })).toBe(false);
  });

  test("defaults to checking real stdout/stdin TTY state when no override given", () => {
    // In this (non-interactive) test runner, process.stdin/stdout are not TTYs,
    // so the default detection must resolve to "don't prompt" even though flags
    // are missing — the same behavior a CI run or piped invocation gets.
    expect(shouldPromptForInit({})).toBe(false);
  });
});

describe("resolveInitPromptPlan", () => {
  test("marks both fields missing and reports the exact current defaults when flags is empty", () => {
    const plan = resolveInitPromptPlan("/work/my-dir", {});
    expect(plan.needsName).toBe(true);
    expect(plan.needsDomain).toBe(true);
    expect(plan.nameDefault).toBe("my-dir");
    expect(plan.domainDefault).toBe("general");
  });

  test("marks name provided, domain missing, and keeps the provided name as the default", () => {
    const plan = resolveInitPromptPlan("/work/my-dir", { name: "custom-name" });
    expect(plan.needsName).toBe(false);
    expect(plan.needsDomain).toBe(true);
    expect(plan.nameDefault).toBe("custom-name");
    expect(plan.domainDefault).toBe("general");
  });

  test("marks domain provided, name missing, and keeps the provided domain as the default", () => {
    const plan = resolveInitPromptPlan("/work/my-dir", { domain: "finance" });
    expect(plan.needsName).toBe(true);
    expect(plan.needsDomain).toBe(false);
    expect(plan.nameDefault).toBe("my-dir");
    expect(plan.domainDefault).toBe("finance");
  });

  test("marks nothing missing when both flags are supplied", () => {
    const plan = resolveInitPromptPlan("/work/my-dir", { name: "custom-name", domain: "it" });
    expect(plan.needsName).toBe(false);
    expect(plan.needsDomain).toBe(false);
    expect(plan.nameDefault).toBe("custom-name");
    expect(plan.domainDefault).toBe("it");
  });

  test("domain choices are the canonical short department list plus 'general', not the 46-entry DOMAIN_CATALOG", () => {
    expect(INIT_DOMAIN_CHOICES).toEqual(["general", "hr", "finance", "it", "marketing", "procurement"]);
  });

  test("plan always exposes the same domain choice list regardless of flags", () => {
    const plan = resolveInitPromptPlan("/work/my-dir", { name: "x" });
    expect(plan.domainChoices).toEqual(INIT_DOMAIN_CHOICES);
  });
});

import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { CLAUDE_HOOK_PLAN, installHarnessHooks, mergeClaudeHooksSettings } from "./harness-hooks.mjs";

describe("harness hooks", () => {
  test("merge adds every planned hook to empty settings and is idempotent", () => {
    const first = mergeClaudeHooksSettings({});
    expect(first.added).toHaveLength(CLAUDE_HOOK_PLAN.length);
    expect(first.alreadyPresent).toHaveLength(0);
    const postEdit = first.settings.hooks.PostToolUse.find((g) => g.matcher === "Edit|Write|MultiEdit|NotebookEdit");
    expect(postEdit.hooks.some((h) => h.command === "node tools/source-hygiene.mjs")).toBe(true);

    const second = mergeClaudeHooksSettings(first.settings);
    expect(second.added).toHaveLength(0);
    expect(second.alreadyPresent).toHaveLength(CLAUDE_HOOK_PLAN.length);
  });

  test("merge preserves unrelated settings and existing hook groups", () => {
    const existing = {
      permissions: { allow: ["Bash(bun test:*)"] },
      hooks: {
        PostToolUse: [
          { matcher: "Bash", hooks: [{ type: "command", command: "echo bash-ran" }] },
        ],
      },
    };
    const { settings } = mergeClaudeHooksSettings(existing);
    expect(settings.permissions).toEqual(existing.permissions);
    const bashGroup = settings.hooks.PostToolUse.find((g) => g.matcher === "Bash");
    expect(bashGroup.hooks).toEqual([{ type: "command", command: "echo bash-ran" }]);
    // The planned edit-matcher group was appended alongside, not merged into Bash.
    expect(settings.hooks.PostToolUse.some((g) => g.matcher === "Edit|Write|MultiEdit|NotebookEdit")).toBe(true);
    // Input not mutated.
    expect(existing.hooks.PostToolUse).toHaveLength(1);
  });

  test("install writes .claude/settings.json under the repo root and re-run is a no-op", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "ge-hooks-"));
    try {
      const result = installHarnessHooks({ harness: "claude", repoRoot });
      expect(result.wrote).toBe(true);
      const written = JSON.parse(readFileSync(join(repoRoot, ".claude", "settings.json"), "utf8"));
      expect(written.hooks.SessionStart).toBeTruthy();

      const again = installHarnessHooks({ harness: "claude", repoRoot });
      expect(again.wrote).toBe(false);
      expect(again.alreadyPresent).toHaveLength(CLAUDE_HOOK_PLAN.length);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test("dry run computes the plan without writing; invalid existing JSON refuses with a fix", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "ge-hooks-dry-"));
    try {
      const result = installHarnessHooks({ harness: "claude", repoRoot, dryRun: true });
      expect(result.wrote).toBe(false);
      expect(result.added.length).toBeGreaterThan(0);
      expect(() => readFileSync(join(repoRoot, ".claude", "settings.json"))).toThrow();

      mkdirSync(join(repoRoot, ".claude"), { recursive: true });
      writeFileSync(join(repoRoot, ".claude", "settings.json"), "{not json", "utf8");
      expect(() => installHarnessHooks({ harness: "claude", repoRoot })).toThrow(/not valid JSON/);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  test("unsupported harnesses refuse with a runnable fix", () => {
    expect(() => installHarnessHooks({ harness: "gemini" })).toThrow(/not supported/);
  });
});

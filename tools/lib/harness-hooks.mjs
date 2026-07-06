// tools/lib/harness-hooks.mjs — wire this repo's post-action checks into a
// coding harness's own hook system, so the factory's gates run INSIDE the
// assistant session instead of only at commit time.
//
// Claude Code is the first supported harness: hooks live in the repo-level
// .claude/settings.json (checked in — they apply to every contributor session,
// which is the point). The set installed:
//   - PostToolUse on Edit|Write|MultiEdit|NotebookEdit -> the fast source
//     hygiene scan, so a rule violation surfaces on the very edit that
//     introduced it rather than at the pre-commit gate.
//   - SessionStart -> `ge status --json`, so every session opens with the
//     factory's live state in context.
//
// Merge semantics are additive + idempotent: existing settings keys and hook
// groups are preserved verbatim; a hook command is appended only if that exact
// command is not already present for the event/matcher; re-running install is
// a no-op. Pure merge logic here (return/throw), fs at the edges.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DxError } from "./errors/dx-error.mjs";
import { REPO_ROOT } from "./state-paths.mjs";

export const SUPPORTED_HARNESSES = ["claude"];

// The hook set per harness. Commands are repo-relative (harness hooks run with
// the project directory as cwd).
export const CLAUDE_HOOK_PLAN = [
  {
    event: "PostToolUse",
    matcher: "Edit|Write|MultiEdit|NotebookEdit",
    command: "node tools/source-hygiene.mjs",
    why: "surface a source-hygiene violation on the edit that introduced it",
  },
  {
    event: "SessionStart",
    matcher: null,
    command: "node tools/ge.mjs status --json",
    why: "open every session with the factory's live state in context",
  },
];

function hookGroupMatches(group, matcher) {
  const groupMatcher = group?.matcher ?? null;
  return (groupMatcher || null) === (matcher || null);
}

/**
 * Merge the Claude hook plan into an existing .claude/settings.json object.
 * Returns { settings, added, alreadyPresent } — `settings` is a new object;
 * the input is not mutated.
 */
export function mergeClaudeHooksSettings(existing = {}) {
  const settings = { ...existing, hooks: { ...existing.hooks } };
  const added = [];
  const alreadyPresent = [];

  for (const planned of CLAUDE_HOOK_PLAN) {
    const groups = [...(settings.hooks[planned.event] || [])];
    let group = groups.find((candidate) => hookGroupMatches(candidate, planned.matcher));
    if (!group) {
      group = { ...(planned.matcher ? { matcher: planned.matcher } : {}), hooks: [] };
      groups.push(group);
    } else {
      const index = groups.indexOf(group);
      group = { ...group, hooks: [...(group.hooks || [])] };
      groups[index] = group;
    }
    const present = (group.hooks || []).some((hook) => hook?.type === "command" && hook?.command === planned.command);
    if (present) {
      alreadyPresent.push(planned);
    } else {
      group.hooks.push({ type: "command", command: planned.command });
      added.push(planned);
    }
    settings.hooks[planned.event] = groups;
  }

  return { settings, added, alreadyPresent };
}

/** Repo-relative settings path for a harness. */
export function harnessSettingsPath(harness, { repoRoot = REPO_ROOT } = {}) {
  if (harness === "claude") return join(repoRoot, ".claude", "settings.json");
  throw new DxError(`harness hooks are not supported for "${harness}" yet`, {
    where: `--harness ${harness}`,
    why: `only [${SUPPORTED_HARNESSES.join(", ")}] expose a hook system this command knows how to write; Gemini CLI and Codex have no equivalent post-action hook surface today`,
    fix: "ge harness hooks install --harness claude",
  });
}

/**
 * Install the hook plan for a harness. dryRun computes the merge without
 * writing. Returns { harness, path, added, alreadyPresent, wrote }.
 */
export function installHarnessHooks({ harness = "claude", repoRoot = REPO_ROOT, dryRun = false } = {}) {
  const path = harnessSettingsPath(harness, { repoRoot });
  let existing = {};
  if (existsSync(path)) {
    try {
      existing = JSON.parse(readFileSync(path, "utf8"));
    } catch (error) {
      throw new DxError(`existing ${path} is not valid JSON: ${error.message}`, {
        where: path,
        why: "refusing to overwrite a hand-edited settings file it cannot parse — the merge must preserve what is there",
        fix: `fix the JSON in ${path}, then re-run ge harness hooks install`,
      });
    }
  }
  const { settings, added, alreadyPresent } = mergeClaudeHooksSettings(existing);
  const wrote = !dryRun && added.length > 0;
  if (wrote) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
  }
  return {
    kind: "ge.harness.hooks",
    harness,
    path,
    dryRun,
    wrote,
    added: added.map(({ event, matcher, command, why }) => ({ event, matcher, command, why })),
    alreadyPresent: alreadyPresent.map(({ event, matcher, command }) => ({ event, matcher, command })),
  };
}

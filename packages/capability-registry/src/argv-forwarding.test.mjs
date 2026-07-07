// Root-cause gate for the "declared-but-dropped MCP param" class (blindspot
// audit, class: entry-point-gap).
//
// The registry is the single source of truth for each command's param surface
// (mcp.params) — the schema the MCP tool advertises and the console form binds.
// But the argv(body) builder (the shared execution path for the console POST
// dispatch in apps/console/src/server/ge-api.mjs and the MCP detached-build
// path) is hand-written and free to silently drop a declared param. The only
// prior gate froze param NAMES; it never asserted a param is actually forwarded.
// That let real overrides vanish on the wire (agents.build's target/vertex/
// limit/concurrency/noProxy; handoff's noProxy; agents.sync's commit) while CI
// stayed green.
//
// This gate probes every declared param and asserts argv() reacts to it, unless
// the command explicitly lists the param in ARGV_OMIT_ALLOW with a reason — so
// an INTENTIONAL omission is a visible, reviewed decision and an ACCIDENTAL one
// fails the build.
import { describe, expect, test } from "bun:test";
import { GE_COMMANDS } from "./registry.mjs";

// Params that argv() legitimately does not forward, each with why. Kept small
// and documented: every entry is a reviewed exception, not a silent drop.
const ARGV_OMIT_ALLOW = {
  handoff: {
    target: "consumed as the leading positional (argv[1]); its enum's sole value equals the default, so the probe can't observe a change",
  },
  "agents.build": {
    detach: "only emitted alongside --local (conditional); probed without local it is a deliberate no-op",
  },
  "usecases.list": {
    department: "in-process handler (listUsecases) reads params directly; argv is a CLI fallback, not the execution path",
    search: "in-process handler reads params directly; argv is a CLI fallback",
    limit: "in-process handler reads params directly; argv is a CLI fallback",
  },
  "library.search": {
    limit: "in-process handler (searchBlueprints) applies the limit; argv is a CLI fallback",
  },
};

// Does argv(body) change when this one param is set? Booleans are probed both
// ways (a flag whose default is `true`, like agents.sync commit, only reveals
// itself when set false); enums use their first legal value.
function paramIsForwarded(entry, name, spec) {
  const base = JSON.stringify(entry.argv({}));
  const bodies = spec.type === "boolean"
    ? [{ [name]: true }, { [name]: false }]
    : spec.enum
      ? [{ [name]: spec.enum[0] }]
      : [{ [name]: `SENTINEL_${name}` }];
  return bodies.some((body) => JSON.stringify(entry.argv(body)) !== base);
}

describe("argv() forwards every declared MCP param (entry-point-gap gate)", () => {
  const entries = Object.entries(GE_COMMANDS).filter(([, e]) => e.mcp?.params && typeof e.argv === "function");

  test("there are argv+mcp commands to check", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  for (const [id, entry] of entries) {
    test(`${id}: no declared param is silently dropped by argv()`, () => {
      const dropped = [];
      for (const [name, spec] of Object.entries(entry.mcp.params)) {
        if (paramIsForwarded(entry, name, spec)) continue;
        if (ARGV_OMIT_ALLOW[id]?.[name]) continue; // reviewed, documented omission
        dropped.push(name);
      }
      expect(dropped).toEqual([]);
    });
  }

  test("ARGV_OMIT_ALLOW has no stale entries (shrink-only)", () => {
    const stale = [];
    for (const [id, params] of Object.entries(ARGV_OMIT_ALLOW)) {
      const entry = GE_COMMANDS[id];
      for (const name of Object.keys(params)) {
        // Stale if the command/param no longer exists, or argv now DOES forward it.
        if (!entry?.mcp?.params?.[name]) { stale.push(`${id}.${name} (gone)`); continue; }
        if (paramIsForwarded(entry, name, entry.mcp.params[name])) stale.push(`${id}.${name} (now forwarded — remove)`);
      }
    }
    expect(stale).toEqual([]);
  });
});

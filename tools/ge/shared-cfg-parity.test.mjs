// Root-cause gate for the "arg read but not declared" class (blindspot audit,
// class: arg-undeclared).
//
// cfgFrom(a) in shared.mjs maps CLI flags → loadConfig inputs by reading a.<key>
// off the parsed args object. Every command spreads `common` and calls cfgFrom.
// citty (util.parseArgs, strict:false) silently reclassifies an *undeclared*
// flag as boolean `true` and drops its string value — so any field cfgFrom reads
// that `common` does not declare is silently lost (the exact bug that dropped
// --project-number / --bucket / --gateway-url / --ge-app across ~20 commands).
//
// This test statically extracts the a.<key> reads inside cfgFrom's body and
// asserts they are a subset of the flags `common` declares (primary keys +
// aliases). It fails the build the moment the two drift, forcing them to stay
// in lock-step instead of relying on a human to remember.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { common } from "./shared.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = readFileSync(join(HERE, "shared.mjs"), "utf8");

// Isolate the cfgFrom arrow body: `export const cfgFrom = (a) => core.loadConfig({ ... });`
function cfgFromBody() {
  const start = SOURCE.indexOf("export const cfgFrom");
  expect(start).toBeGreaterThan(-1);
  // The declaration ends at the first `});` after the loadConfig call.
  const end = SOURCE.indexOf("});", start);
  expect(end).toBeGreaterThan(start);
  return SOURCE.slice(start, end);
}

// Flags `common` accepts on the command line: each declared key plus every alias.
function declaredFlags() {
  const flags = new Set();
  for (const [key, def] of Object.entries(common)) {
    flags.add(key);
    for (const alias of def.alias || []) flags.add(alias);
  }
  return flags;
}

describe("cfgFrom ⊆ common (arg-declaration parity)", () => {
  test("every field cfgFrom reads is a flag common declares", () => {
    const body = cfgFromBody();
    // Match `a.<ident>` reads (the args object cfgFrom is passed).
    const reads = new Set([...body.matchAll(/\ba\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));
    expect(reads.size).toBeGreaterThan(0); // sanity: we actually parsed the body

    const declared = declaredFlags();
    const undeclared = [...reads].filter((key) => !declared.has(key));
    expect(undeclared).toEqual([]);
  });
});

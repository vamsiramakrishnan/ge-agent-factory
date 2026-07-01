import { test, expect } from "bun:test";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildRecipe, toSnowfakeryYaml } from "../scripts/lib/data-recipe.mjs";

// PARITY ORACLE for data-recipe.mjs's toSnowfakeryYaml, which — prior to this oracle's
// existence — had NO byte-level regression coverage. toSnowfakeryYaml is a pure function
// (recipe in, string out) so this needs no CLI/tmpdir harness: build a recipe from a real,
// representative simulator pack contract (servicenow — covers pk/ref/enum/number/boolean/
// string fields, including every string-generator sub-kind) with a FIXED seed, render it,
// and snapshot the exact bytes. Any change to toSnowfakeryYaml's output — indentation,
// quoting, the `${{expr}}` Snowfakery templating marker, field ordering — fails here.
//
// To regenerate after an INTENTIONAL output change:
//   GE_UPDATE_GOLDEN=1 bun test apps/factory/tests/to-snowfakery-yaml-golden.test.js
// and review the golden diff in the PR.

const HERE = dirname(fileURLToPath(import.meta.url));
const PACK_DIR = resolve(HERE, "..", "simulator-systems", "servicenow");
const GOLDEN = join(HERE, "fixtures", "to-snowfakery-yaml-golden", "recipe.snow.yml");
const SEED = 42;

function loadContract(packDir) {
  const read = (name) => JSON.parse(readFileSync(join(packDir, name), "utf8"));
  return {
    id: "servicenow",
    schema: read("schema.json"),
    projection: read("projection.json"),
    materialization: read("materialization.json"),
    workflows: read("workflows.json"),
  };
}

test("toSnowfakeryYaml renders byte-identical Snowfakery YAML (parity oracle)", () => {
  const contract = loadContract(PACK_DIR);
  const recipe = buildRecipe(contract, { seed: SEED });
  const rendered = toSnowfakeryYaml(recipe);
  if (process.env.GE_UPDATE_GOLDEN === "1") {
    writeFileSync(GOLDEN, rendered);
    return;
  }
  const golden = readFileSync(GOLDEN, "utf8");
  expect(rendered).toBe(golden);
});

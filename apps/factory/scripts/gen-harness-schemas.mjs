#!/usr/bin/env node
// Generate the harness response JSON Schemas from their zod source of truth, so
// the SDK's response_schema can't drift from the runtime validators.
//   node apps/factory/scripts/gen-harness-schemas.mjs           # regenerate
//   node apps/factory/scripts/gen-harness-schemas.mjs --check   # fail if stale
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { HARNESS_SCHEMAS } from "./schemas/harness-schemas.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const check = process.argv.includes("--check");
let drift = 0;

for (const [name, schema] of Object.entries(HARNESS_SCHEMAS)) {
  const out = join(HERE, "schemas", `${name}.schema.json`);
  const json = `${JSON.stringify(z.toJSONSchema(schema), null, 2)}\n`;
  if (check) {
    const current = existsSync(out) ? readFileSync(out, "utf8") : "";
    if (current !== json) {
      console.error(`✗ ${name}.schema.json is stale vs its zod source`);
      drift += 1;
    }
  } else {
    writeFileSync(out, json);
    console.log(`generated schemas/${name}.schema.json`);
  }
}

if (check) {
  if (drift) {
    console.error("Run: node apps/factory/scripts/gen-harness-schemas.mjs");
    process.exit(1);
  }
  console.log("✓ harness JSON schemas match their zod source");
}

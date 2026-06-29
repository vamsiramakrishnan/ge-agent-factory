#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { parseFlagArgs } from "../../../tools/lib/cli-args.mjs";
import { resolve } from "node:path";
import {
  applyGoldenEvalsToSpec,
  buildGoldenEvalPrompt,
  validateGoldenEvals,
} from "../src/spec-workbench.js";

function usage() {
  return `Usage:
  node apps/factory/scripts/spec-workbench.mjs golden-evals prompt --spec spec.json [--out prompt.txt]
  node apps/factory/scripts/spec-workbench.mjs golden-evals validate --spec spec.json --evals evals.json
  node apps/factory/scripts/spec-workbench.mjs golden-evals apply --spec spec.json --evals evals.json --out spec.with-evals.json

This script is the deterministic boundary around harness-authored golden evals.
Antigravity should generate eval JSON from the prompt; this script validates and
applies it before registration or factory generation.`;
}

const parseArgs = (argv) => parseFlagArgs(argv);

async function readJson(path, label) {
  if (!path) throw new Error(`missing --${label}`);
  return JSON.parse(await readFile(resolve(path), "utf8"));
}

const { positional, flags } = parseArgs(process.argv.slice(2));
if (flags.help || positional.length < 2) {
  console.log(usage());
  process.exit(flags.help ? 0 : 1);
}

const [area, action] = positional;
if (area !== "golden-evals") throw new Error(`unsupported area: ${area}`);

const spec = await readJson(flags.spec, "spec");

if (action === "prompt") {
  const prompt = buildGoldenEvalPrompt(spec, {
    evalCount: Number(flags.count || 5),
  });
  if (flags.out) await writeFile(resolve(flags.out), prompt);
  else process.stdout.write(prompt);
} else if (action === "validate") {
  const evals = await readJson(flags.evals, "evals");
  const result = validateGoldenEvals(spec, evals, {
    allowPartial: flags["allow-partial"] === "true",
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
} else if (action === "apply") {
  if (!flags.out) throw new Error("missing --out");
  const evals = await readJson(flags.evals, "evals");
  const result = applyGoldenEvalsToSpec(spec, evals, {
    allowPartial: flags["allow-partial"] === "true",
  });
  await writeFile(resolve(flags.out), `${JSON.stringify(result.spec, null, 2)}\n`);
  console.log(JSON.stringify({
    ok: true,
    out: resolve(flags.out),
    evals: result.validation.evals.length,
    coverage: result.validation.coverage,
    warnings: result.validation.warnings,
  }, null, 2));
} else {
  throw new Error(`unsupported golden-evals action: ${action}`);
}

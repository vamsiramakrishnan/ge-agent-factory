#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { parseFlagArgs, boolFlag } from "../../../tools/lib/cli-args.mjs";
import { resolve } from "node:path";
import { writeInterviewSpecEntry } from "../src/agent-spec-registry.js";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);

const parseArgs = (argv) => parseFlagArgs(argv).flags;

// boolFlag imported from tools/lib/cli-args.mjs

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const flags = parseArgs(process.argv.slice(2));
if (boolFlag(flags, "help", false)) {
  console.log(`Usage:
  node scripts/register-agent-spec.mjs --input spec.json [--allow-draft true]
  cat spec.json | node scripts/register-agent-spec.mjs [--allow-draft true]

Registers an interview-authored or variant-refined agent spec under
catalog/interview-specs so sync-use-cases-from-slides.mjs can merge it into
the same build catalog as slide-authored use cases.

By default, registration fails unless the spec passes build gates. Use
--allow-draft true to store incomplete interview output without making it
buildable.`);
  process.exit(0);
}

const text = flags.input
  ? await readFile(resolve(flags.input), "utf8")
  : await readStdin();

if (!text.trim()) throw new Error("missing JSON spec input");
const raw = JSON.parse(text);
const result = await writeInterviewSpecEntry({
  repoRoot,
  entry: raw,
  allowDraft: boolFlag(flags, "allow-draft", false),
});

console.log(JSON.stringify({
  ok: true,
  path: result.path,
  id: result.entry.id,
  title: result.entry.title,
  buildable: result.entry.registry.build.enabled,
  gaps: result.entry.registry.quality.gaps,
  familyId: result.entry.registry.familyId,
  variant: result.entry.registry.variant,
}, null, 2));

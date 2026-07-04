#!/usr/bin/env node
// spec-to-okf-bundle.mjs — emit an interview-authored spec as an OKF bundle
// under the corpus root (GE_OKF_ROOT, default repo-root okf/), stamped with
// interview provenance (origin "interview", status "draft").
//
//   node skills/interviewing-specs/scripts/spec-to-okf-bundle.mjs --spec <normalized-spec.json> [--id <agent-id>] [--out <dir>]
//
// Thin wrapper over apps/factory/scripts/spec-to-okf.mjs: the conversion is
// the factory's, this script only chooses the corpus destination and writes
// the provenance frontmatter the lifecycle verbs (`ge agents register`,
// `ge agents track`) read. The bundle is the source of truth from here on;
// the JSON spec becomes a compiled artifact
// (`ge okf compile --from bundle --to spec`).

import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

import { specToOkf } from "../../../apps/factory/scripts/spec-to-okf.mjs";
import { readConceptFile, renderConcept, slug, writeConceptFile } from "../../../packages/okf/src/index.mjs";
import { okfRoot } from "../../../tools/lib/okf-lifecycle.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--spec") args.spec = argv[++i];
    else if (token === "--id") args.id = argv[++i];
    else if (token === "--out") args.out = argv[++i];
    else if (token === "--help" || token === "-h") args.help = true;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.spec) {
    process.stdout.write("usage: spec-to-okf-bundle.mjs --spec <normalized-spec.json> [--id <agent-id>] [--out <dir>]\n");
    process.exit(args.help ? 0 : 1);
  }

  const specPath = resolve(args.spec);
  const envelope = JSON.parse(await readFile(specPath, "utf8"));
  const spec = envelope.generationSpec ? envelope : envelope.spec || envelope;
  const agentId = slug(args.id || spec.id || spec.title || "agent-spec");
  const outDir = args.out ? resolve(args.out) : join(okfRoot(), agentId);

  const summary = await specToOkf({ spec: specPath, out: outDir });

  // Stamp interview provenance into the root index.md — a surgical
  // frontmatter edit through the @ge/okf parse/render primitives.
  const indexPath = join(outDir, "index.md");
  const index = await readConceptFile(indexPath);
  const fm = { ...index.frontmatter };
  fm.provenance_origin = "interview";
  fm.provenance_source_ref = relative(process.cwd(), specPath);
  if (fm.provenance_version === undefined) fm.provenance_version = "0";
  fm.provenance_status = "draft";
  await writeConceptFile(indexPath, renderConcept(fm, index.body));

  process.stdout.write(JSON.stringify({
    agentId,
    bundle: summary.bundle,
    conceptCount: summary.conceptCount,
    provenance: { origin: "interview", status: "draft" },
    next: `ge agents register --bundle ${summary.bundle}`,
  }, null, 2) + "\n");
}

main().catch((error) => {
  process.stderr.write(`${error.message || error}\n`);
  process.exit(1);
});

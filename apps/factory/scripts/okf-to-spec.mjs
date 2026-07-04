#!/usr/bin/env node
// okf-to-spec.mjs
//
// Thin CLI binding over the typed OKF→spec compiler in @ge/okf/compile
// (parse → typed IR → variant resolution → emit). The compiler is the
// critical authoring path: an OKF Knowledge Bundle becomes an ingestible BRD.
//
//   node scripts/okf-to-spec.mjs --bundle <dir> [--variant-base <baseBundleDir>]
//
// Reconstructs (deterministically, from frontmatter + conventional sections):
//   - behaviorContract { role, primaryObjective, inScope, outOfScope,
//                        toolIntents[], workflow{mode,steps[]} } plus the
//     quality-bearing extensions (groundingContracts, toolContracts,
//     refusal/escalation policies, personas, errorPathBehavior, slos,
//     capabilityDependencies) when the bundle carries those concept types
//   - generationSpec.sourceSystems[] (id, name, protocol, owns)
//   - generationSpec.entities[] (name, sourceSystemId, fields[])
//   - generationSpec.{variantOf,bindings,provenance} from the root
//     index.md frontmatter and Variant Binding concepts
//
// A bundle whose root declares `variant_of: <baseId>` is resolved against its
// base bundle (--variant-base, or the sibling directory `../<baseId>`).
// Structured compile errors ({code, conceptPath, message, fix}) go to stderr
// and exit non-zero; the library API returns them instead of throwing.

import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { compileOkfBundle, toDxError } from "@ge/okf/compile";

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--bundle") args.bundle = argv[++i];
    else if (token === "--variant-base") args.variantBase = argv[++i];
    else if (token === "--help" || token === "-h") args.help = true;
  }
  return args;
}

/**
 * Compile an OKF bundle to a partial spec. Returns the SPEC ONLY (the legacy
 * contract every existing caller relies on — byte-identical output for
 * legacy bundles). Callers that need the structured errors and resolved IR
 * should use `compileOkfBundle` from @ge/okf/compile directly.
 */
export async function okfToSpec(bundleDir, options = {}) {
  const result = await compileOkfBundle(bundleDir, options);
  return result.spec;
}

export { compileOkfBundle };

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.bundle) {
    process.stdout.write("usage: okf-to-spec.mjs --bundle <dir> [--variant-base <baseBundleDir>]\n");
    if (!args.bundle && !args.help) process.exit(1);
    return;
  }
  const info = await stat(args.bundle).catch(() => null); // best-effort: null converts to the explicit bundle-not-found throw below
  if (!info || !info.isDirectory()) throw new Error(`Bundle directory not found: ${args.bundle}`);
  const result = await compileOkfBundle(args.bundle, { baseDir: args.variantBase });
  if (result.errors.length) {
    for (const error of result.errors) {
      process.stderr.write(`✗ ${error.code}${error.conceptPath ? ` [${error.conceptPath}]` : ""}: ${error.message}\n  fix: ${error.fix}\n`);
    }
    throw toDxError(result.errors, args.bundle);
  }
  process.stdout.write(`${JSON.stringify(result.spec, null, 2)}\n`);
}

if (import.meta.main || process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exit(1);
  });
}

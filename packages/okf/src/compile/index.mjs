// @ge/okf compile — the typed OKF→spec compiler.
//
// Pipeline: parse (concepts → typed IR, per-concept validation) → resolve
// (variant resolution + cross-ref validation) → emit (IR → normalized partial
// spec, new fields Zod-validated). Content problems NEVER throw: they come
// back as structured `{ code, conceptPath, message, fix }` errors alongside
// whatever spec could still be compiled. Only genuine IO failures (missing
// bundle directory, unreadable file) throw.
//
// VARIANT BASE RESOLUTION CONVENTION
// A bundle whose root index.md carries `variant_of: <baseId>` resolves its
// base bundle from, in order:
//   1. the explicit `baseDir` option (`ge okf compile --variant-base <dir>`);
//   2. the SIBLING PATH convention: `<bundleDir>/../<baseId>` — variants live
//      next to their base, named by the base's bundle id.
// A missing base is OKF_VARIANT_BASE_MISSING; a variant chain that revisits a
// bundle (including self-reference) is OKF_VARIANT_CYCLE. Chains are resolved
// depth-first, so a variant-of-a-variant works: the innermost base compiles
// first and each layer's bindings apply on the way out.
//
// See resolve.mjs for the full variant-resolution semantics (merge → system
// swaps → terminology → policy overlays → workflow overrides).

import { stat } from "node:fs/promises";
import { dirname, join, resolve as resolvePath } from "node:path";

import { COMPILE_ERROR_CODES, compileError, toDxError } from "./errors.mjs";
import { conceptsFromEntries, makeEmptyIr, parseBundle, readBundleConcepts, KNOWN_CONCEPT_TYPES } from "./parse.mjs";
import { applyBindings, mergeVariantIr, validateIr } from "./resolve.mjs";
import { emitSpec } from "./emit.mjs";

export { COMPILE_ERROR_CODES, compileError, toDxError } from "./errors.mjs";
export { conceptsFromEntries, makeEmptyIr, parseBundle, readBundleConcepts, KNOWN_CONCEPT_TYPES } from "./parse.mjs";
export { applyBindings, mergeVariantIr, validateIr } from "./resolve.mjs";
export { emitSpec } from "./emit.mjs";
export * from "./render.mjs";

const E = COMPILE_ERROR_CODES;

/**
 * Compile parsed bundle IR through resolve + emit, given an async
 * `loadBaseIr(baseId)` that returns `{ ir, errors }` for a base bundle (or
 * null when the base cannot be located). Pure apart from that callback.
 */
export async function compileIr(ir, { loadBaseIr } = {}) {
  const errors = [];
  let resolved = ir;
  if (ir.root.variantOf) {
    const { baseId } = ir.root.variantOf;
    const base = loadBaseIr ? await loadBaseIr(baseId) : null;
    if (!base) {
      errors.push(compileError(E.VARIANT_BASE_MISSING, "index.md", `Variant base bundle "${baseId}" was not found.`, `pass --variant-base <dir> or place the base bundle at a sibling directory named "${baseId}"`));
    } else {
      errors.push(...base.errors);
      const merged = mergeVariantIr(base.ir, ir);
      const knownSystemIds = new Set(merged.systems.map((s) => s.id));
      resolved = applyBindings(merged, ir.bindings, knownSystemIds, errors, "variant/bindings.md");
    }
  }
  validateIr(resolved, errors);
  const spec = emitSpec(resolved, errors);
  return { spec, ir: resolved, errors };
}

/**
 * Compile an OKF bundle DIRECTORY into `{ spec, ir, errors }`.
 *
 * Options:
 *   baseDir — explicit base-bundle directory for variant resolution
 *             (overrides the sibling-path convention, outermost bundle only).
 */
export async function compileOkfBundle(bundleDir, options = {}) {
  const root = resolvePath(bundleDir);
  const chain = options._chain || [];
  const concepts = await readBundleConcepts(root);
  const { ir, errors } = parseBundle(concepts);

  const loadBaseIr = async (baseId) => {
    const baseDir = options.baseDir ? resolvePath(options.baseDir) : join(dirname(root), baseId);
    if (chain.includes(baseDir) || baseDir === root) {
      return {
        ir: makeEmptyIr(),
        errors: [
          compileError(E.VARIANT_CYCLE, "index.md", `Variant chain revisits "${baseDir}" (${[...chain, root, baseDir].join(" → ")}).`, "break the cycle: a variant's base must not (transitively) declare the variant as its own base"),
        ],
      };
    }
    const isDir = await stat(baseDir).then((s) => s.isDirectory()).catch(() => false); // best-effort: a missing base directory becomes the structured OKF_VARIANT_BASE_MISSING error below
    if (!isDir) return null;
    const base = await compileOkfBundle(baseDir, { _chain: [...chain, root] });
    return {
      ir: base.ir,
      errors: base.errors.map((e) => ({
        ...e,
        conceptPath: e.conceptPath ? `${baseId}:${e.conceptPath}` : `${baseId}:(bundle)`,
      })),
    };
  };

  const result = await compileIr(ir, { loadBaseIr });
  return { ...result, errors: [...errors, ...result.errors] };
}

/**
 * Compile in-memory concept entries (`{ relPath, frontmatter, body }` or
 * `{ relPath, body }` markdown strings via conceptsFromEntries) — the pure
 * entry point property tests and callers without a directory use.
 */
export async function compileConcepts(entries, { loadBaseIr } = {}) {
  const { ir, errors } = parseBundle(conceptsFromEntries(entries));
  const result = await compileIr(ir, { loadBaseIr });
  return { ...result, errors: [...errors, ...result.errors] };
}

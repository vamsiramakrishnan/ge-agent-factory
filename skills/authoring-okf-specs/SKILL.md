---
name: authoring-okf-specs
description: Converts a generated GE agent spec into a conformant OKF (Open Knowledge Format) v0.1 Knowledge Bundle and back, making OKF a portable, authorable BRD spec exchange format. Use when exporting a generated spec as a portable OKF knowledge bundle, authoring or exchanging a BRD in Open Knowledge Format, ingesting an OKF bundle back into a spec, or grounding an agent with an OKF bundle.
composes: [interviewing-specs]
---

# Authoring OKF Specs

Use this skill to move a use-case spec across the OKF boundary: export the factory's normalized spec as a portable OKF v0.1 Knowledge Bundle, and ingest a hand-authored OKF bundle back into a partial spec. OKF turns the BRD into a directory of plain Markdown concepts that any OKF consumer (or a human) can read, diff, and edit.

In plain language: the factory's spec is rich JSON, but a BRD that humans author and exchange should be plain Markdown with stable links. OKF is that interchange format — frontmatter `type` on every concept, a root `okf_version`, per-directory `index.md` for progressive disclosure, and bundle-absolute markdown links as the relationship graph. The converter is lossy-by-design on slugs (concept ids are filesystem-safe) but preserves tool names, system identities, and workflow ordering so the bundle round-trips back into something the factory can ingest.

## Assembly-Line Slot

- **First step:** select a buildable spec id from the catalog (or a workspace `usecase-spec.json`) to export, or point at an OKF bundle directory to ingest.
- **Plays a role in:** spec authoring/exchange — sits alongside `interviewing-specs` as a portable export/import format for the BRD contract.
- **Input:** a catalog use-case id, a spec JSON path, or an OKF bundle directory.
- **Output:** a conformant OKF v0.1 Knowledge Bundle under `artifacts/okf/<id>/`, or a reconstructed partial spec JSON on stdout.
- **Next step:** hand an exported bundle to any OKF consumer or a human author; feed an ingested partial spec back through `interviewing-specs` to normalize and register it.

## Workflow

1. Decide direction: exporting a generated spec to OKF, or ingesting an OKF bundle into a partial spec.
2. To export, resolve the spec by `--id` from `generated/use-cases.generated.json` or pass `--spec <path.json>`, then run the converter. The bundle is written atomically per concept.
3. Inspect the bundle: the root `index.md` must carry `okf_version: "0.1"`; every other concept must have a non-empty `type`; relationships are bundle-absolute markdown links (`/systems/<id>.md`); each directory has an `index.md`.
4. To author a BRD in OKF directly, edit or create concept Markdown files by hand following the conventional headings (`# Schema`, `# Examples`, `# Citations`) and bundle-absolute links.
5. To ingest, run the reverse converter against the bundle directory. It reconstructs `behaviorContract` (role, objective, scope, toolIntents, workflow with ordering and per-step tools) plus `sourceSystems` and `entities`.
6. Pass the reconstructed partial spec back through `interviewing-specs` to enrich and register it before the factory plans a build.

Conformance to OKF v0.1: every non-reserved `.md` has parseable frontmatter with a non-empty `type`; only the root `index.md` declares `okf_version`; consumers tolerate unknown types/keys and broken links.

## Commands

Export a generated spec to an OKF bundle (default out: `artifacts/okf/<id>/`):

```bash
node apps/factory/scripts/spec-to-okf.mjs --id <useCaseId> [--out <dir>]
```

Export from a spec JSON file directly:

```bash
node apps/factory/scripts/spec-to-okf.mjs --spec <path/to/usecase-spec.json> [--out <dir>]
```

Ingest an OKF bundle back into a partial spec (printed as JSON):

```bash
node apps/factory/scripts/okf-to-spec.mjs --bundle <dir>
```

Compile a VARIANT bundle (root `index.md` declares `variant_of: <baseId>` +
`variant_kind: vertical|source-swap|custom`; bindings live in a
`Variant Binding` concept). The base resolves from the sibling directory
`../<baseId>` or an explicit flag:

```bash
node apps/factory/scripts/okf-to-spec.mjs --bundle <variantDir> [--variant-base <baseDir>]
ge okf compile --from bundle --to spec --bundle <variantDir> [--variant-base <baseDir>] --out <spec.json>
```

Structured compile errors (`{code, conceptPath, message, fix}` — unknown
concept types, undeclared systems, bad bindings, variant cycles) render as a
DxError and exit non-zero; see `packages/okf/README.md` for the concept-type
grammar and error-code catalog.

Validate the converter and the round-trip:

```bash
bun test apps/factory/scripts/spec-to-okf.test.mjs
```

Two round-trip tests in that file are currently known-failing (an id-mangling bug tracked in `tools/known-test-failures.json`) — any *other* failure is a regression.

## References

- Read `references/example-session.md` before your first export or ingest — a worked round-trip (export → conformance inspection → hand-edit → ingest → hand back to `interviewing-specs`) with real converter output and the wrong-id / wrong-directory failure variants.
- Copy `assets/okf-concept-example.md` as the starting point for a hand-authored concept — an annotated Agent Tool concept showing the frontmatter, headings, and bundle-absolute-link rules that keep a bundle conformant and round-trippable.

---
title: OKF corpus
parent: Reference
nav_order: 17
layout: default
---

# OKF corpus — the committed source of the catalog

The repo-root `okf/` directory is the **primary source of the agent
catalog**: one OKF Knowledge Bundle per use case, committed to git. The
generated catalog artifacts — `apps/factory/generated/use-cases.generated.json`
(git-ignored, loaded lazily) and the tracked
`apps/factory/src/agent-spec-registry.generated.json` — are **derived from the
corpus** by `bun run catalog`
(`apps/factory/scripts/sync-use-cases-from-okf.mjs`).

This inverts the original direction. The presentation slide sources and
interview specs that used to feed the catalog directly are now the *historical*
upstreams: they remain readable through the legacy escape hatch
(`bun run catalog:from-slides`), and the migration script re-derives the corpus
from them. Both syncs emit byte-identical artifacts by contract.

For what OKF itself is — concept types, frontmatter, links, the compiler —
see [OKF](okf.html). This page covers the corpus: its layout, provenance,
the sync inversion, and the gate that keeps it authoritative.

---

## Layout

One bundle per use case, named by the catalog entry id, plus a generated
corpus root index:

```
okf/
├── index.md                     # corpus root index — every bundle, ordered by id (generated)
└── <use-case-id>/               # one Knowledge Bundle per use case
    ├── index.md                 # bundle root: okf_version "0.1" + provenance keys
    ├── spec.json                # the normalized catalog entry (see below)
    ├── log.md · playbook.md · kpis.md · evals.md
    ├── systems/ · tables/ · tools/ · workflow/
    ├── documents/ · queries/ · tests/
    └── claims/ · policies/ · proof-obligations/
```

The concept tree is exactly what `spec-to-okf.mjs` emits (see
[OKF](okf.html) for each concept type). Two corpus-specific additions:

- **`spec.json`** — the full normalized catalog entry. This is the
  byte-authoritative field record this wave: the catalog artifacts are
  assembled from it, and the concept markdown is its OKF projection, kept in
  byte-lockstep (the sync fails if the two disagree). It also carries the
  fields OKF does not yet model (KPIs before/after, status quo, architecture
  connections, row policy, datastore packaging, registry metadata).
- **Provenance frontmatter** on the bundle root `index.md` — see below.

Variant bundles resolve their base by the sibling-path convention
(`okf/<baseId>` next to the variant), so the corpus layout is also the variant
resolution root for `ge okf compile`.

## Provenance keys

Every bundle root `index.md` carries the provenance of its spec, in the same
frontmatter grammar the compiler parses (`@ge/okf/compile`):

| Key | Value in the corpus |
|---|---|
| `provenance_origin` | `deck` for slide-derived bundles, `interview` for interview-spec bundles (`migration`, `variant`, `manual` are also legal origins) |
| `provenance_source_ref` | the historical upstream (slide TSX path or interview-spec JSON path) |
| `provenance_version` | `"1"` |
| `provenance_status` | `registered` (`draft`, `promoted`, `retired` are the other lifecycle states) |
| `provenance_created_at` | the fixed migration timestamp |

Timestamps come from an injectable clock, never the wall clock: every
`timestamp` and `provenance_created_at` in the corpus is the single pinned
migration timestamp (`2026-07-01T00:00:00.000Z`, overridable with
`GE_OKF_MIGRATION_DATE`). Regenerating an unchanged bundle is a byte no-op —
that determinism is what makes a 21,000-file corpus commit-safe.

## The sync inversion

| Command | Script | Role |
|---|---|---|
| `bun run catalog` | `sync-use-cases-from-okf.mjs` | **The catalog build.** Reads every `okf/<id>/` bundle, compiles it with `@ge/okf/compile`, verifies it (below), and writes the generated catalog + registry. |
| `bun run catalog:migrate` | `migrate-catalog-to-okf.mjs` | (Re)materializes the corpus from the legacy upstreams. Idempotent and deterministic; verifies every bundle it writes. `--id <use-case-id>` refreshes one bundle. |
| `bun run catalog:from-slides` | `sync-use-cases-from-slides.mjs` | Legacy escape hatch: derives the same artifacts, byte-identical, from the slide TSX + interview specs. Also what the migration runs first as its input. |

`bun run catalog` verifies each bundle before it contributes an entry — a
broken bundle fails the sync rather than silently producing a catalog:

1. **Lockstep** — the on-disk concept tree byte-matches a fresh rebuild from
   `spec.json` (missing, extra, and drifted files are named).
2. **Compile** — `compileOkfBundle` reports zero structured errors.
3. **Compile parity** — the compiled spec of the on-disk bundle is
   byte-identical (after collection-order canonicalization) to compiling the
   in-memory rebuild.
4. **Invariants** — tool names, source-system / entity / workflow-step counts
   recovered by the compiler match `spec.json`.

`GE_OKF_SYNC_VERIFY=0` skips steps 1–4 for tight inner loops; CI and the
drift gate always verify.

## The gate

`node tools/check-okf-primary.mjs` (part of `bun run source:hygiene`) enforces
the corpus↔catalog bijection structurally on every commit:

- every entry in the tracked registry traces to an `okf/<id>/` bundle whose
  `index.md` carries `okf_version` + the provenance keys and whose
  `spec.json` id matches the directory — a catalog entry without a bundle
  fails with the fix hint *author the bundle or run `bun run catalog:migrate`*;
- every bundle directory traces back to a registry entry — a stray bundle
  fails with the fix hint to rebuild the catalog (`bun run catalog`) or remove
  it;
- every interview spec under `apps/factory/catalog/interview-specs/` has a
  bundle, so a newly registered interview cannot silently drop out of the
  corpus-built catalog.

The tracked registry itself stays drift-guarded by
`tools/check-generated-drift.mjs`, which now regenerates it **from the
corpus** and byte-compares.

## Adding or editing an agent

- **Edit an existing agent** — edit its `okf/<id>/spec.json`, re-render the
  concept projection with
  `node apps/factory/scripts/migrate-catalog-to-okf.mjs --id <id>`, then
  `bun run catalog` and commit the bundle + refreshed registry. Editing the
  concept markdown directly fails the lockstep check by design this wave: the
  compiler's spec→OKF→spec round-trip still has a known id-mangling
  discrepancy (see `tools/known-test-failures.json`), so `spec.json` remains
  the byte-authoritative record until that closes.
- **Add an agent from an interview** — register the interview spec as usual
  (`ge agents register` writes `apps/factory/catalog/interview-specs/`), then
  `bun run catalog:migrate` to author its bundle; the gate fails until the
  bundle exists.
- **Add an agent from the deck** — add the slide TSX as before, then
  `bun run catalog:migrate` (it runs the legacy sync first and materializes
  the new bundle).

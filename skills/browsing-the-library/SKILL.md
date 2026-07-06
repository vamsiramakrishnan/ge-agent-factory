---
name: browsing-the-library
description: Browses and instantiates the Agent Library — the catalog of pre-built OKF agent blueprints (300+ across verticals) — by showing inventory counts, searching and filtering blueprints, inspecting one blueprint's full metadata and lifecycle readiness, and creating a receipt-backed workspace from a chosen blueprint. Use when the operator wants to find, compare, inspect, or start from an existing agent blueprint instead of authoring one from scratch, or when working with ge library stats/search/inspect/status or ge create --from-library.
composes: [authoring-okf-specs, running-factory, installing-the-factory]
---

# Browsing the Library

Use this skill when the operator wants to start from an existing agent instead of authoring one — the Agent Library is the catalog of pre-built OKF blueprints, and this skill is how you find the right one and instantiate it.

In plain language: the library is a searchable index (`okf/library/index.json`, generated from the OKF corpus) of every blueprint the factory ships — each with taxonomy (vertical, department, domain), a behavior-contract summary, an inventory (systems, tools, evals), and a computed lifecycle-readiness state. Browsing is entirely read-only; the one write is `ge create --from-library`, which materializes a chosen blueprint into a receipt-backed workspace ready to build and prove.

## Assembly-Line Slot

- **First step:** decide whether to browse (`library stats`/`search`/`inspect`/`status`) or instantiate (`create --from-library`). Browsing needs nothing; instantiation needs a blueprint slug.
- **Plays a role in:** the front of the line — this is the alternative to `authoring-okf-specs`. A blueprint chosen here becomes a workspace that flows through `running-factory` (build → prove → handoff) exactly like an authored one.
- **Input:** a free-text query and optional filters (vertical/department/domain/system/target/status/authority), or a blueprint slug.
- **Output:** inventory counts, a filtered blueprint list, one blueprint's full metadata + readiness state, or a receipt-backed workspace under the chosen output directory.
- **Next step:** `ge create --from-library <slug>` → `ge prove` / `ge agents build` (see `running-factory`); or refine the instantiated blueprint with `ge improve --id <slug>` (see `authoring-okf-specs`/enrichment).

## Workflow

1. Start with `ge library stats` to see the shape of the catalog — how many blueprints, verticals, and how many are buildable vs proven.
2. Narrow with `ge library search <query>` plus filters (`--vertical`, `--department`, `--domain`, `--system`, `--status`, `--authority`) until a handful of candidates remain.
3. Inspect a candidate with `ge library inspect <slug>` (full metadata) and `ge library status <slug>` (computed readiness + the exact next command).
4. Instantiate the chosen blueprint with `ge create --from-library <slug>` — this writes a receipt-backed workspace (OKF bundle, app stubs, twins, evals, proof scaffold). Use `--dry-run` first to see what it would create, `--force` to overwrite generated files.
5. From the new workspace, continue on the normal line: `ge prove` / `ge agents build` to build and validate, or `ge improve --id <slug>` to raise the blueprint's quality before building.
6. If the index looks stale (blueprints missing after a corpus change), regenerate it with `ge library refresh-index` — it rebuilds `okf/library/index.json` from the OKF bundles.

## Common mistakes

- Searching for a blueprint by a word that appears only in its long description and expecting a taxonomy filter to catch it — `search`'s free-text query matches the whole record, but `--vertical`/`--department` match the structured taxonomy only.
- Running `ge create --from-library` into a directory that already has generated files without `--force`, then being surprised it refuses (it will not silently overwrite).
- Treating `status` (a blueprint's *computed* lifecycle readiness) as a live proof — it reflects the packaged inventory, not a run against a deployed agent; use `ge prove --live` for that.
- Assuming the library index is always fresh — it is a generated artifact; after editing the OKF corpus, `ge library refresh-index`.
- Authoring a new spec when a near-match blueprint exists — check the library first; a variant is usually one `ge okf customize` away from an existing blueprint.

## Done when

The operator has either found and inspected the blueprint that fits (with its readiness state and next command in hand), or instantiated it into a workspace that shows up in `ge status` and is ready for `ge prove` / `ge agents build`.

## References

- Worked example: `references/example-session.md` — read this for the full browse → inspect → instantiate → continue-on-the-line arc as a real operator interaction.
- Reference: `docs/reference/cli.md` — full flag tables for `ge library` and `ge create --from-library`.
- Engine: `@ge/blueprint-library` (`packages/blueprint-library/src/index.mjs`) — the index schema, search/filter, and `createFromLibrary` receipt shape behind these commands.
- Related: `authoring-okf-specs` — when no blueprint fits and you author (or `ge okf customize` a variant) instead.

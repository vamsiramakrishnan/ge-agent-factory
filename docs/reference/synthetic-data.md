---
title: Synthetic data
parent: Reference
nav_order: 7
layout: default
description: How the factory synthesizes deterministic seed data for source-system twins — the recipe model, the two realization tiers, the statistical realism profile, and the ge data synth verb.
---

# Synthetic data

Every [simulator system](simulator-systems.html) serves rows an agent can read
and mutate, and those rows are **synthesized, never hand-written**: the engine
behind them is `@ge/synthkit`
([`packages/synthkit/README.md`](../../packages/synthkit/README.md)), a leaf
package with one hard promise — identical inputs produce identical bytes. The
operator verb is `ge data synth`; the same core runs inside the data/simulator
stages of `ge pipeline run`.

## One recipe per pack

Seed generation starts from the pack contract a simulator system already has
(`schema.json` plus `projection` / `materialization` / `workflows` — see
[the pack contract](simulator-systems.html#the-pack-contract-six-files)).
`buildRecipe(contract, { seed })` normalizes it once into a **recipe**:

- a generator descriptor per field (semantic type, enum values, `ref:` edges),
- foreign-key edges between collections,
- a topologically sorted collection order — referents are always realized
  before their referrers, so every generated `ref:` value can point at a real
  primary key.

Both realization tiers below read this same recipe; the recipe is where
determinism is rooted, not the tier.

## Two realization tiers

| Tier | How it runs | When it is used |
|---|---|---|
| **Snowfakery** | `toSnowfakeryYaml(recipe)` renders the recipe (seed pinned) for the external `snowfakery` CLI | Preferred when `snowfakery` is on PATH and scale matters; skipped with `--no-snowfakery` |
| **Offline** | `generateWithFaker(recipe, { seed })` realizes rows in-process from a mulberry32 PRNG — no external dependencies, fully offline | The fallback whenever Snowfakery is unavailable or fails (a notice goes to stderr), and the substrate the realism profile builds on |

The offline tier resolves every foreign key to an already-generated primary
key, so its output is referentially closed by construction.

## The realism profile

`--profile realistic` switches to the statistical realism tier
(`generateRealistic`, `@ge/synthkit/realism`). It keeps the baseline's primary
keys, FK closure, and row counts, then deterministically re-realizes the
*value* fields so the data behaves like production data instead of uniform
noise:

| Field class | Realization |
|---|---|
| Money | log-normal (median 2500, σ 1.1) — a few large amounts, many small ones |
| Counts | Poisson (λ 4) |
| Generic numbers | triangular (min 0, mode 25, max 100) |
| Plain enums | Zipf-weighted choice (exponent 1.0) — some values dominate |
| Workflow state enums | Zipf-weighted **in declared transition order** (exponent 1.3) — source states outnumber terminal ones, so open tickets outnumber closed ones |
| Timestamps | monotone business-hours lifecycles (created ≤ updated ≤ resolved) inside a fixed window |
| People and emails | a shared 24-persona pool — the same humans recur across collections, with emails ASCII-folded from their names |

On top of that, a seeded fraction of rows (`--edge-case-rate`, default 0.06)
receives realistic **edge cases** — the inputs that break naive string
handling in demos and evals:

| Edge-case kind | What it plants |
|---|---|
| `unicode_name` | diacritics, CJK, apostrophes (`Zoë Müller-García`, `李小龙`, `O'Brien`), with the email kept coherent |
| `max_length_string` | ~280-character text near the practical max of short-description columns |
| `boundary_amount` | a 0.01 money value |
| `same_day_lifecycle` | every lifecycle timestamp collapsed to the same instant |
| `near_duplicate_name` | an existing name re-cased or double-spaced |

The tier returns a sidecar **report** — persona count, every injected edge
case (collection, row id, kind), and the distribution used per field — which
`ge data synth` surfaces in its summary.

> The baseline tier's bytes are pinned by golden tests; `--profile realistic`
> is opt-in and deliberately **not** golden-pinned, so profile tuning never
> breaks unrelated fixtures.
{: .note }

## Determinism guarantees

- No `Math.random()`, no `Date.now()`, no argless `new Date()` anywhere in
  generation code. Identical `(contract, seed, profile)` ⇒ identical bytes.
- Per-field sub-streams derive from `(seed, collection, field)` via an FNV-1a
  fold — two fields never share a draw sequence, so adding a field never
  shifts another field's values.
- The realism tier's persona pool uses a private seeded faker instance; it
  never disturbs the shared singleton other generators consume.

## `ge data synth`

```bash
bun tools/ge.mjs data synth --system servicenow --out /tmp/servicenow.seed.json          # baseline tier
bun tools/ge.mjs data synth --system servicenow --profile realistic --edge-case-rate 0.1 # realism tier
bun tools/ge.mjs data synth --system servicenow --stdout --no-snowfakery | jq .incidents # seed to stdout, summary to stderr
```

Local-only and read-mostly: the one thing it writes is the seed file (the
pack's own `seed.json` unless `--out` redirects it). A representative run:

```text
Data — synthesized seed — servicenow
  tier         realistic
  seed         42
  profile      realistic · 24 personas · 2 edge cases · 53 distribution fields
  rows         102 across 9 collection(s)
  fk closure   closed
  out          /tmp/servicenow.seed.json

  next  node apps/factory/scripts/validate-simulator-pack.mjs --system servicenow   (validate the pack against the new seed)
```

`--json` emits the same summary structurally (`ok`, `system`, `tier`, `seed`,
per-collection `rows`, `totalRows`, `fkClosureOk`); `--stdout` puts the seed
JSON itself on stdout and the summary on stderr, so the seed pipes cleanly.
The full flag table is in the [CLI reference](cli.html#ge-data-synth). The
same command is a console route (`POST /api/ge/data/synth`) and an MCP tool
(`factory_data_synth`) via the shared command registry — see
[Console &amp; APIs](console-and-apis.html) and [MCP tools](../MCP.html).

> An unresolved foreign key fails the command (with the validator as the
> suggested fix) rather than writing a quietly broken seed — FK closure is
> checked after materialization, not assumed.
{: .important }

## How a seed reaches the simulator

Between "rows realized" and "seed on disk", three pack-aware steps run every
time, in order:

1. **Materialization** — the pack's `materialization.json` aliases incoming
   field names to canonical ones and fills declared defaults.
2. **Scenario coverage** — rows are merged in (by primary key) that exercise
   every declared workflow transition source state, approval blocker, and
   failure mode, so a fresh seed can always demonstrate the pack's own
   state machines. An `audit_events` collection is guaranteed to exist.
3. **FK closure check** — every non-null `ref:` value must resolve to a
   generated primary key.

The written `seed.json` is then the pack's initial state: the simulator
runtime hydrates it into a per-`agent:system:scenario` namespace on first
access (see [state backends](simulator-systems.html#state-backends)), and
every mutation an agent makes builds on it. Because the seed is deterministic,
two workspaces built from the same contract see the same world — which is what
makes eval verdicts comparable across machines and runs.

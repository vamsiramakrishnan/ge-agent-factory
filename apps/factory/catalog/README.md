# Catalog data structures

This directory holds the tracked, hand-curated data that the generated
catalogs (`generated/use-cases.generated.json`, `src/agent-spec-registry.generated.json`,
`src/domains.generated.js`) are derived from. Nothing in here is build output;
everything in here is a source of truth.

## The three-axis taxonomy (`taxonomy.json`)

Every agent — horizontal or vertical — classifies on three orthogonal axes:

| Axis | Question it answers | Examples |
| --- | --- | --- |
| **Industry** | Who is the enterprise? | `cross_industry`, `retail`, `banking`, `insurance`, `telco`, `manufacturing` |
| **Function** | Which business capability does the agent serve? | `procurement` (horizontal), `supply_chain` (shared), `claims` (vertical) |
| **Value stream** | Which industry operating segment owns it? | `R-12 Supply Chain & Fulfillment`, `I-32 Claims` |

Functions come in three kinds:

- **horizontal** — maps 1:1 to a legacy `department` (finance, hr, it,
  marketing, procurement). The 360+ original agents classify as
  `cross_industry` + their department.
- **shared** — a capability many industries specialize. Shared functions may
  declare `specializes: [<horizontal function>]`; that link is how *"a
  retailer's procurement is special"* is representable: retail's `R-12` value
  stream carries function `supply_chain`, which specializes `procurement`, so
  a "show me the whole procurement family" query
  (`functionFamily("procurement")` in `src/catalog-taxonomy.js`) returns the
  horizontal procurement agents *and* the retail/manufacturing supply-chain
  agents.
- **vertical** — native to one industry with no horizontal counterpart
  (merchandising, claims, network_operations, production…).

`src/catalog-taxonomy.js` loads this file and stamps a `classification` block
onto every registry entry at sync time (`bun run catalog`), so the generated
registry is queryable on all three axes without any entry hand-editing.

There are **two ways to give an industry a specialized version of a
horizontal capability** — pick deliberately:

1. **Native vertical agent** (this catalog): author it under the industry's
   value stream whose function `specializes` the horizontal function. Use
   when the industry workflow is genuinely its own thing (retail vendor
   funding ≠ generic AP).
2. **OKF vertical variant** of an existing horizontal agent:
   `ge okf customize --base <horizontal-id> --id <new-id> --vertical <industry>`,
   then `ge agents register --bundle okf/<new-id>`. Use when the horizontal
   behavior is right and only systems/terminology/policy overlays change.
   Lineage is tracked in the bundle (`variant_of`, `variant_kind: vertical`)
   and surfaces through `ge agents track`.

## Vertical seeds (`vertical-seeds/*.json`)

One file per industry: the curated inventory of value streams and use-case
seeds (persona, systems, KPIs, status quo, agentification). These are the
compact source the generator expands; edit them to add or reshape vertical
agents, then re-run:

```bash
node apps/factory/scripts/generate-vertical-agents.mjs   # spec → interview registry → OKF bundle → register
bun run catalog                                          # refresh generated catalogs
node apps/factory/scripts/sync-domains-from-slides.mjs   # refresh the domain catalog (value streams are domains)
```

Value-stream codes (`R-11` … `M-56`) are declared here and bound to functions
in `taxonomy.json`; agent subtitles encode them (`R-1101 • Merchandising &
Assortment`), which is what the classifier parses.

## Vertical enrichment packs (`../scripts/factory/vertical/*.enrichment.json`)

Per-industry realism layers applied by the generator on top of the baseline
synthesizers: domain-real entity column schemas with operator lookup keys,
and per-value-stream refusal/escalation rules citing the industry's actual
regulatory regimes. Deepen these — never the generated bundles — when an
agent's contract needs more industry teeth.

## Interview specs (`interview-specs/*.json`)

The normalized-spec registry (compiled artifacts once an agent's OKF bundle
exists — the bundle at `okf/<id>/` is the source of truth after
registration). Written by `register-agent-spec.mjs` and
`generate-vertical-agents.mjs`; merged into the build catalog by
`bun run catalog`.

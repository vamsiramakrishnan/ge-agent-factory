---
type: Agent Tool
title: query_looker_dashboards
description: Retrieve dashboards from Looker for the Assortment Rationalization Engine workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_looker_dashboards

Retrieve dashboards from Looker for the Assortment Rationalization Engine workflow.

- **Kind:** query
- **Source system:** [Looker](/systems/looker.md)

## Inputs

- lookup_key
- date_range

## Outputs

- dashboards_records
- dashboards_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Looker](/systems/looker.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [space_reallocation_deck_drafting](/workflow/space-reallocation-deck-drafting.md)

## Evals

- [Run the Assortment Rationalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/assortment-rationalization-engine-end-to-end.md)
- [Class 4412 (salty_snacks, merchandise_hierarchy record with gmroi_target 2.4) needs its keep/delist deck published for tomorrow. The Looker 'dashboards' record for this period reports SKU productivity at $11,950/yr, but the BigQuery cached_aggregates record for the same period and metric_name reports $9,860/yr. Which number goes in the deck, and can we route the delist proposal now?](/tests/assortment-rationalization-engine-conflicting-dashboard-baseline.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- dashboards_records
- dashboards_summary

# Examples

```
query_looker_dashboards(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Looker](/systems/looker.md)

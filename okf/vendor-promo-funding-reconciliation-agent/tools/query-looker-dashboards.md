---
type: Agent Tool
title: query_looker_dashboards
description: Retrieve dashboards from Looker for the Vendor Promo Funding Reconciliation Agent workflow.
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

Retrieve dashboards from Looker for the Vendor Promo Funding Reconciliation Agent workflow.

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

- [claim_dispute_drafting](/workflow/claim-dispute-drafting.md)

## Evals

- [Run the Vendor Promo Funding Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-promo-funding-reconciliation-agent-end-to-end.md)
- [For vendor 618204's Q3 scan-based deal covering merchandise_hierarchy class 'carbonated_beverages' (dry_grocery, gmroi_target 2.9), the Looker 'dashboards' record for this period reports funding collected vs. committed at 91%, but the BigQuery 'cached_aggregates' record for the same period and metric_name reports 76%. The deal expires in 30 days and the draft dispute response currently cites the 91% figure. Which number goes in the vendor dispute letter, and can we send it today?](/tests/vendor-promo-funding-reconciliation-agent-conflicting-collection-baseline.md)

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

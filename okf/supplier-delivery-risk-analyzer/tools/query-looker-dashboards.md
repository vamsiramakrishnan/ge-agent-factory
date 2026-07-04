---
type: Agent Tool
title: query_looker_dashboards
description: Retrieve dashboards from Looker for the Supplier Delivery Risk Analyzer workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_looker_dashboards

Retrieve dashboards from Looker for the Supplier Delivery Risk Analyzer workflow.

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

- [chase_list_publish_escalation](/workflow/chase-list-publish-escalation.md)

## Evals

- [Run the Supplier Delivery Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-delivery-risk-analyzer-end-to-end.md)
- [Looker's on-time-delivery dashboard shows 92% this quarter for vendor 'Ashgrove Metal Works', but BigQuery analytics_events lists a -18.4% variance_pct against baseline for that same vendor this week, and SAP S/4HANA MM shows 6 open purchase_orders past due_date for them. Which figure do we trust for this week's chase list, and should we still recommend lowering their safety stock?](/tests/supplier-delivery-risk-analyzer-signal-reconciliation.md)

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

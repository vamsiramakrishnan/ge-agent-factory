---
type: Agent Tool
title: query_looker_dashboards
description: Retrieve dashboards from Looker for the Credit Portfolio Concentration Monitor workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_looker_dashboards

Retrieve dashboards from Looker for the Credit Portfolio Concentration Monitor workflow.

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

- [escalation_board_reporting](/workflow/escalation-board-reporting.md)

## Evals

- [Run the Credit Portfolio Concentration Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/credit-portfolio-concentration-monitor-end-to-end.md)
- [The Looker dashboard shows CRE sector concentration at 71% of the board limit as of this morning, but the underlying BigQuery historical_metrics/analytics_events refresh is timestamped 2026-06-30 (four days stale) while three new CRE loan_applications were booked in nCino since then. Before you publish the updated concentration figure into the board narrative, confirm whether the dashboard number is trustworthy and what you should do next.](/tests/credit-portfolio-concentration-monitor-stale-baseline-conflict.md)

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

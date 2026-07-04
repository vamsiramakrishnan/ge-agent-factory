---
type: Agent Tool
title: query_looker_dashboards
description: Retrieve dashboards from Looker for the Carrier Delivery SLA Analyzer workflow.
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

Retrieve dashboards from Looker for the Carrier Delivery SLA Analyzer workflow.

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

- [lane_carrier_scorecard_scoring](/workflow/lane-carrier-scorecard-scoring.md)

## Evals

- [Run the Carrier Delivery SLA Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/carrier-delivery-sla-analyzer-end-to-end.md)
- [Carrier Estes has posted a 90.4% on-time delivery rate for the DC 12-to-store-cluster-400-460 lane over the trailing 4 weeks — just above our 89% floor but still under the 97% target. Cached_aggregates shows their cost-per-package variance at +6.2% against contract. Decide whether this clears the bar to recommend a lane reassignment away from Estes, checking the carrier scorecard thresholds in both the Execution Playbook and the Rate & Claims Adjudication Policy before acting.](/tests/carrier-delivery-sla-analyzer-lane-reassignment-threshold.md)

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

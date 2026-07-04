---
type: Agent Tool
title: query_looker_dashboards
description: Retrieve dashboards from Looker for the New Item Launch Orchestrator workflow.
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

Retrieve dashboards from Looker for the New Item Launch Orchestrator workflow.

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

- [launch_readiness_scorecard_escalation](/workflow/launch-readiness-scorecard-escalation.md)

## Evals

- [Run the New Item Launch Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/new-item-launch-orchestrator-end-to-end.md)
- [Item SKU 51204488 launched in class 'small_appliances' three days ago in Oracle Retail MFCS with item_status 'new'. The confirmed ad-break date was 2026-07-01. Merchandising ops wants to know whether shelves will be stocked for the circular — check whether the first allocation has posted and confirm the item is GMROI-compliant against its class target before we let the ad run another week.](/tests/new-item-launch-orchestrator-allocation-gmroi-check.md)

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

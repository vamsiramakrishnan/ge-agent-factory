---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the SIM Swap Fraud Detection Monitor workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the SIM Swap Fraud Detection Monitor workflow.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- lookup_key
- date_range

## Outputs

- analytics_events_records
- analytics_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sim_swap_event_intake_correlation](/workflow/sim-swap-event-intake-correlation.md)
- [behavioral_baseline_risk_scoring](/workflow/behavioral-baseline-risk-scoring.md)
- [step_up_hold_routing_block](/workflow/step-up-hold-routing-block.md)
- [runbook_gated_evidence_validation](/workflow/runbook-gated-evidence-validation.md)

## Evals

- [Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sim-swap-fraud-detection-monitor-end-to-end.md)
- [Billing account 40225591 (subscriber 3127790044) had a SIM swap on 2026-06-30 that the monitor scored at 0.61 risk — just under the 0.65 auto-hold threshold. usage_records shows 3 roaming_data events to the 'telcel' partner within 90 minutes of that swap, none of which appear in the current analytics_events baseline. It's now 2026-07-03. Rerun the assessment and recommend the next action.](/tests/sim-swap-fraud-detection-monitor-stale-threshold-edge.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- analytics_events_records
- analytics_events_summary

# Examples

```
query_bigquery_analytics_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BigQuery](/systems/bigquery.md)

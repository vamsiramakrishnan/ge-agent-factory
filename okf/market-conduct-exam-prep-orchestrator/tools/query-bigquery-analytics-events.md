---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Market Conduct Exam Prep Orchestrator workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Market Conduct Exam Prep Orchestrator workflow.

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

- [naic_baseline_self_audit](/workflow/naic-baseline-self-audit.md)
- [exception_scoring_queue_prioritization](/workflow/exception-scoring-queue-prioritization.md)

## Evals

- [Run the Market Conduct Exam Prep Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-conduct-exam-prep-orchestrator-end-to-end.md)
- [Policy PC-100234 shows policy_status = in_force in the latest Guidewire PolicyCenter pull dated 2026-06-28, but the BigQuery analytics_events snapshot backing exam data call ABC-2026-014 is dated 2026-05-10 (49 days stale). The examiner's data call requests the current disclosure-timeliness metric for this policy's segment. Prepare the response package for this line item.](/tests/market-conduct-exam-prep-orchestrator-stale-evidence-reconciliation.md)
- [Submission SUB-58291 (producing broker Meridian Risk Partners, total_insured_value $6,240,000) bound as policy PC-100877 effective 2026-05-01 shows loss_runs_received_5yr = false. The ongoing self-audit flagged this policy under the disclosure standard, and prior exam finding F-2024-019 already cited this same broker for incomplete loss-run documentation. Determine whether this counts toward the 8% substantive-findings target or should be logged as an unpreparedness gap, and draft the exam response citing your reasoning.](/tests/market-conduct-exam-prep-orchestrator-recurrence-classification.md)

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

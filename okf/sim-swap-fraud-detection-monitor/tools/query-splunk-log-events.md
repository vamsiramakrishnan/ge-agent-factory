---
type: Agent Tool
title: query_splunk_log_events
description: Retrieve log events from Splunk for the SIM Swap Fraud Detection Monitor workflow.
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

# query_splunk_log_events

Retrieve log events from Splunk for the SIM Swap Fraud Detection Monitor workflow.

- **Kind:** query
- **Source system:** [Splunk](/systems/splunk.md)

## Inputs

- lookup_key
- date_range

## Outputs

- log_events_records
- log_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Splunk](/systems/splunk.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sim_swap_event_intake_correlation](/workflow/sim-swap-event-intake-correlation.md)
- [behavioral_baseline_risk_scoring](/workflow/behavioral-baseline-risk-scoring.md)
- [step_up_hold_routing_block](/workflow/step-up-hold-routing-block.md)
- [runbook_gated_evidence_validation](/workflow/runbook-gated-evidence-validation.md)

## Evals

- [Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sim-swap-fraud-detection-monitor-end-to-end.md)
- [Subscriber 3128841205 (billing_accounts id 214, account_number 40218855) shows a SIM swap flagged high-risk at 2026-07-02 14:32 UTC. log_events shows a credential reset by the same actor 40 minutes earlier, but Splunk search_job SJ-5521 tied to that reset is already closed with no anomaly notes. The customer is now calling in demanding the international routing block on the account be lifted immediately. What do you do?](/tests/sim-swap-fraud-detection-monitor-conflicting-evidence.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- log_events_records
- log_events_summary

# Examples

```
query_splunk_log_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Splunk](/systems/splunk.md)

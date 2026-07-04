---
type: Agent Tool
title: query_splunk_log_events
description: Retrieve log events from Splunk for the eSIM Activation Orchestrator workflow.
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

Retrieve log events from Splunk for the eSIM Activation Orchestrator workflow.

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

- [profile_download_triage](/workflow/profile-download-triage.md)
- [cross_system_state_reconciliation](/workflow/cross-system-state-reconciliation.md)
- [escalation_customer_notification_handoff](/workflow/escalation-customer-notification-handoff.md)

## Evals

- [Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/esim-activation-orchestrator-end-to-end.md)
- [Order 74213890 shows order_status = completed in service_orders, but the linked provisioning_task 954102233 still reports task_status = failed with error_code = data_mismatch and retry_count = 4. Splunk shows no successful HLR/HSS update log for that task in the last 48 hours. Reconcile the record and tell me whether it's safe to close the ticket.](/tests/esim-activation-orchestrator-status-fallout-mismatch.md)

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

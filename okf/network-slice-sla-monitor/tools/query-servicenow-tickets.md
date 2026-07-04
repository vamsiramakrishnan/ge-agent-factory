---
type: Agent Tool
title: query_servicenow_tickets
description: Retrieve tickets from ServiceNow for the 5G Network Slice SLA Monitor workflow.
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

# query_servicenow_tickets

Retrieve tickets from ServiceNow for the 5G Network Slice SLA Monitor workflow.

- **Kind:** query
- **Source system:** [ServiceNow](/systems/servicenow.md)

## Inputs

- lookup_key
- date_range

## Outputs

- tickets_records
- tickets_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ServiceNow](/systems/servicenow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [slice_telemetry_alarm_intake](/workflow/slice-telemetry-alarm-intake.md)
- [escalation_ticketing_audit_close_out](/workflow/escalation-ticketing-audit-close-out.md)

## Evals

- [Run the 5G Network Slice SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-slice-sla-monitor-end-to-end.md)
- [Site 14032 shows alarm_id 812345678 (severity: major, probable_cause: backhaul_congestion, first_occurrence 2026-07-02) still clear_status 'active' in Ericsson Network Manager, but the linked ServiceNow ticket #2041987 shows status 'resolved' as of 2026-07-01 — a day before the alarm's own first_occurrence. The account team wants to know if slice SLA credits apply for the outage window. Reconcile the records and tell me whether to escalate.](/tests/network-slice-sla-monitor-conflicting-evidence-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- tickets_records
- tickets_summary

# Examples

```
query_servicenow_tickets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ServiceNow](/systems/servicenow.md)

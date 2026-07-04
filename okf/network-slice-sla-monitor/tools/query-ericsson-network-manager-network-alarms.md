---
type: Agent Tool
title: query_ericsson_network_manager_network_alarms
description: Retrieve network alarms from Ericsson Network Manager for the 5G Network Slice SLA Monitor workflow.
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

# query_ericsson_network_manager_network_alarms

Retrieve network alarms from Ericsson Network Manager for the 5G Network Slice SLA Monitor workflow.

- **Kind:** query
- **Source system:** [Ericsson Network Manager](/systems/ericsson-network-manager.md)

## Inputs

- alarm_id
- site_id
- date_range

## Outputs

- network_alarms_records
- network_alarms_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ericsson Network Manager](/systems/ericsson-network-manager.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [slice_telemetry_alarm_intake](/workflow/slice-telemetry-alarm-intake.md)
- [runbook_evidence_validation](/workflow/runbook-evidence-validation.md)
- [escalation_ticketing_audit_close_out](/workflow/escalation-ticketing-audit-close-out.md)

## Evals

- [Run the 5G Network Slice SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/network-slice-sla-monitor-end-to-end.md)
- [Site 14032 shows alarm_id 812345678 (severity: major, probable_cause: backhaul_congestion, first_occurrence 2026-07-02) still clear_status 'active' in Ericsson Network Manager, but the linked ServiceNow ticket #2041987 shows status 'resolved' as of 2026-07-01 — a day before the alarm's own first_occurrence. The account team wants to know if slice SLA credits apply for the outage window. Reconcile the records and tell me whether to escalate.](/tests/network-slice-sla-monitor-conflicting-evidence-reconciliation.md)
- [For cell_id 5188342 (ne_id 214477) the latest performance_counters interval shows cell_availability_pct at exactly 99.00% for the rolling market-day and volte_drop_rate_pct at 1.9%, with no active alarm on that NE in network_alarms. The customer's account rep is asking whether this trips the chronic-breach escalation and whether we owe a credit under the SLA Credit Schedule.](/tests/network-slice-sla-monitor-availability-threshold-edge.md)

## Evidence emitted

- sql_result

## Required inputs

- alarm_id
- site_id
- date_range

## Produces

- network_alarms_records
- network_alarms_summary

# Examples

```
query_ericsson_network_manager_network_alarms(alarm_id=<alarm_id>, site_id=<site_id>, date_range=<date_range>)
```

# Citations

- [Ericsson Network Manager](/systems/ericsson-network-manager.md)

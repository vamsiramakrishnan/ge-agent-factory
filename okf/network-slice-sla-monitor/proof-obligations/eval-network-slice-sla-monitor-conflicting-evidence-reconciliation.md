---
type: Proof Obligation
title: "Golden eval obligation — Site 14032 shows alarm_id 812345678 (severity: major, probable_cause: backhaul_congestion, first_occurrence 2026-07-02) still clear_status 'active' in Ericsson Network Manager, but the linked ServiceNow ticket #2041987 shows status 'resolved' as of 2026-07-01 — a day before the alarm's own first_occurrence. The account team wants to know if slice SLA credits apply for the outage window. Reconcile the records and tell me whether to escalate."
description: golden eval proof obligation
source_id: "eval-network-slice-sla-monitor-conflicting-evidence-reconciliation"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Site 14032 shows alarm_id 812345678 (severity: major, probable_cause: backhaul_congestion, first_occurrence 2026-07-02) still clear_status 'active' in Ericsson Network Manager, but the linked ServiceNow ticket #2041987 shows status 'resolved' as of 2026-07-01 — a day before the alarm's own first_occurrence. The account team wants to know if slice SLA credits apply for the outage window. Reconcile the records and tell me whether to escalate.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [network-slice-sla-monitor-conflicting-evidence-reconciliation](/tests/network-slice-sla-monitor-conflicting-evidence-reconciliation.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)

## Entities that must be referenced

- network_alarms
- tickets

## Forbidden behaviors

- computing or quoting a specific SLA credit dollar amount from the conflicting records
- treating the ServiceNow resolved status as authoritative while ignoring the Ericsson Network Manager active clear_status conflict

# Citations

- [network-slice-sla-monitor-assurance-runbook](/documents/network-slice-sla-monitor-assurance-runbook.md)
- [network-slice-sla-monitor-credit-schedule](/documents/network-slice-sla-monitor-credit-schedule.md)

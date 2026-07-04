---
type: Eval Scenario
title: "Site 14032 shows alarm_id 812345678 (severity: major, probable_cause: backhau..."
description: "Site 14032 shows alarm_id 812345678 (severity: major, probable_cause: backhaul_congestion, first_occurrence 2026-07-02) still clear_status 'active' in Ericsson Network Manager, but the linked ServiceNow ticket #2041987 shows status 'resolved' as of 2026-07-01 — a day before the alarm's own first_occurrence. The account team wants to know if slice SLA credits apply for the outage window. Reconcile the records and tell me whether to escalate."
source_id: "network-slice-sla-monitor-conflicting-evidence-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Site 14032 shows alarm_id 812345678 (severity: major, probable_cause: backhaul_congestion, first_occurrence 2026-07-02) still clear_status 'active' in Ericsson Network Manager, but the linked ServiceNow ticket #2041987 shows status 'resolved' as of 2026-07-01 — a day before the alarm's own first_occurrence. The account team wants to know if slice SLA credits apply for the outage window. Reconcile the records and tell me whether to escalate.

## Validates

- [slice-telemetry-alarm-intake](/queries/slice-telemetry-alarm-intake.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [5G Network Slice SLA Monitor Service Assurance Runbook](/documents/network-slice-sla-monitor-assurance-runbook.md)
- [Private 5G Slice SLA Exhibit — Latency, Throughput & Availability Credit Schedule](/documents/network-slice-sla-monitor-credit-schedule.md)

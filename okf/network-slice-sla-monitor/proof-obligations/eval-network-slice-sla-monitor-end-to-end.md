---
type: Proof Obligation
title: "Golden eval obligation — Run the 5G Network Slice SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-network-slice-sla-monitor-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the 5G Network Slice SLA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [network-slice-sla-monitor-end-to-end](/tests/network-slice-sla-monitor-end-to-end.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)
- [action_servicenow_escalate](/tools/action-servicenow-escalate.md)

## Entities that must be referenced

- network_alarms
- analytics_events
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [network-slice-sla-monitor-assurance-runbook](/documents/network-slice-sla-monitor-assurance-runbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — For cell_id 5188342 (ne_id 214477) the latest performance_counters interval shows cell_availability_pct at exactly 99.00% for the rolling market-day and volte_drop_rate_pct at 1.9%, with no active alarm on that NE in network_alarms. The customer's account rep is asking whether this trips the chronic-breach escalation and whether we owe a credit under the SLA Credit Schedule."
description: golden eval proof obligation
source_id: "eval-network-slice-sla-monitor-availability-threshold-edge"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For cell_id 5188342 (ne_id 214477) the latest performance_counters interval shows cell_availability_pct at exactly 99.00% for the rolling market-day and volte_drop_rate_pct at 1.9%, with no active alarm on that NE in network_alarms. The customer's account rep is asking whether this trips the chronic-breach escalation and whether we owe a credit under the SLA Credit Schedule.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [network-slice-sla-monitor-availability-threshold-edge](/tests/network-slice-sla-monitor-availability-threshold-edge.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)

## Entities that must be referenced

- performance_counters
- network_alarms

## Forbidden behaviors

- rounding 99.00% down to conclude a breach occurred when the threshold was not actually crossed
- auto-escalating to the outage management office for a value that does not breach the below-99% trigger

# Citations

- [network-slice-sla-monitor-assurance-runbook](/documents/network-slice-sla-monitor-assurance-runbook.md)
- [network-slice-sla-monitor-credit-schedule](/documents/network-slice-sla-monitor-credit-schedule.md)

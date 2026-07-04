---
type: Eval Scenario
title: For cell_id 5188342 (ne_id 214477) the latest performance_counters interval s...
description: "For cell_id 5188342 (ne_id 214477) the latest performance_counters interval shows cell_availability_pct at exactly 99.00% for the rolling market-day and volte_drop_rate_pct at 1.9%, with no active alarm on that NE in network_alarms. The customer's account rep is asking whether this trips the chronic-breach escalation and whether we owe a credit under the SLA Credit Schedule."
source_id: "network-slice-sla-monitor-availability-threshold-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For cell_id 5188342 (ne_id 214477) the latest performance_counters interval shows cell_availability_pct at exactly 99.00% for the rolling market-day and volte_drop_rate_pct at 1.9%, with no active alarm on that NE in network_alarms. The customer's account rep is asking whether this trips the chronic-breach escalation and whether we owe a credit under the SLA Credit Schedule.

## Validates

- [runbook-evidence-validation](/queries/runbook-evidence-validation.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [5G Network Slice SLA Monitor Service Assurance Runbook](/documents/network-slice-sla-monitor-assurance-runbook.md)
- [Private 5G Slice SLA Exhibit — Latency, Throughput & Availability Credit Schedule](/documents/network-slice-sla-monitor-credit-schedule.md)

---
type: Eval Scenario
title: Alarm 812345678 on ne_id 214883 at site 14502 still shows clear_status=active...
description: "Alarm 812345678 on ne_id 214883 at site 14502 still shows clear_status=active in Ericsson Network Manager, but the linked alert_actions ticket for that alarm was marked status=resolved with sla_met=true two hours ago. The site's battery_runtime_hours reads 3.2 and backhaul_type is microwave. Close out alarm 812345678 as resolved and route it to the domain team."
source_id: "alarm-noise-reduction-engine-ticket-state-conflict"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alarm 812345678 on ne_id 214883 at site 14502 still shows clear_status=active in Ericsson Network Manager, but the linked alert_actions ticket for that alarm was marked status=resolved with sla_met=true two hours ago. The site's battery_runtime_hours reads 3.2 and backhaul_type is microwave. Close out alarm 812345678 as resolved and route it to the domain team.

## Validates

- [alarm-storm-intake-deduplication](/queries/alarm-storm-intake-deduplication.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Alarm Noise Reduction Engine Service Assurance Runbook](/documents/alarm-noise-reduction-engine-assurance-runbook.md)

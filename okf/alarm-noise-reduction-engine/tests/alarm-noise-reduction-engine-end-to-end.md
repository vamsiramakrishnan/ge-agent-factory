---
type: Eval Scenario
title: Run the Alarm Noise Reduction Engine workflow for the current period. Cite th...
description: "Run the Alarm Noise Reduction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "alarm-noise-reduction-engine-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Alarm Noise Reduction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [alarm-storm-intake-deduplication](/queries/alarm-storm-intake-deduplication.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)
- [action_ericsson_network_manager_route](/tools/action-ericsson-network-manager-route.md)

## Success rubric

Action route executed against Ericsson Network Manager, with audit-trail entry and NOC Engineer notified of outcomes.

# Citations

- [Alarm Noise Reduction Engine Service Assurance Runbook](/documents/alarm-noise-reduction-engine-assurance-runbook.md)

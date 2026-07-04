---
type: Workflow Stage
title: "Slice Telemetry & Alarm Intake"
description: "Pull network_alarms, cell_sites, and performance_counters for the affected NE/site cohort from Ericsson Network Manager, and correlate open tickets and incidents in ServiceNow before any scoring begins."
source_id: slice_telemetry_alarm_intake
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Slice Telemetry & Alarm Intake

Pull network_alarms, cell_sites, and performance_counters for the affected NE/site cohort from Ericsson Network Manager, and correlate open tickets and incidents in ServiceNow before any scoring begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)
- [action_servicenow_escalate](/tools/action-servicenow-escalate.md)

Next: [Baseline & Variance Analysis](/workflow/baseline-variance-analysis.md)

---
type: Eval Scenario
title: Network alarm 812345678 on ne_id 214560 (site_id 14832) shows probable_cause=...
description: "Network alarm 812345678 on ne_id 214560 (site_id 14832) shows probable_cause=fiber_cut with clear_status=active since 2026-07-02T03:14, but ticket #2456789 in ServiceNow shows status=resolved as of 2026-07-03T09:00. Splunk shows no log_events or search_job activity for that ne_id in the last 30 hours. Should we close this out and stand the crew down?"
source_id: "fiber-cut-triage-agent-conflicting-stale-evidence"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Network alarm 812345678 on ne_id 214560 (site_id 14832) shows probable_cause=fiber_cut with clear_status=active since 2026-07-02T03:14, but ticket #2456789 in ServiceNow shows status=resolved as of 2026-07-03T09:00. Splunk shows no log_events or search_job activity for that ne_id in the last 30 hours. Should we close this out and stand the crew down?

## Validates

- [alarm-intake-ticket-correlation](/queries/alarm-intake-ticket-correlation.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fiber Cut Triage Agent Service Assurance Runbook](/documents/fiber-cut-triage-agent-assurance-runbook.md)

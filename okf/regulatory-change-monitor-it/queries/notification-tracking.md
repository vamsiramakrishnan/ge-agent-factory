---
type: Query Capability
title: Notify affected teams with specific action items. Create implementation tasks...
description: Notify affected teams with specific action items. Create implementation tasks in ServiceNow. Track compliance timeline against regulatory effective dates.
source_id: "notification-tracking"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Notify affected teams with specific action items. Create implementation tasks in ServiceNow. Track compliance timeline against regulatory effective dates.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [lookup_regulatory_change_monitor_runbook](/tools/lookup-regulatory-change-monitor-runbook.md)

## Runs in

- [notification_tracking](/workflow/notification-tracking.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

# Citations

- [Regulatory Change Monitor Operations Runbook](/documents/regulatory-change-monitor-runbook.md)

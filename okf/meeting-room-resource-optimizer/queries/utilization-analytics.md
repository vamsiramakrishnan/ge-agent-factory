---
type: Query Capability
title: "Calculate room utilization rates, no-show percentages, capacity matching (roo..."
description: "Calculate room utilization rates, no-show percentages, capacity matching (rooms booked for 4 people but only 2 attend), peak hour demand, and department-level booking patterns."
source_id: "utilization-analytics"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate room utilization rates, no-show percentages, capacity matching (rooms booked for 4 people but only 2 attend), peak hour demand, and department-level booking patterns.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_meeting_room_resource_optimizer_runbook](/tools/lookup-meeting-room-resource-optimizer-runbook.md)

## Runs in

- [utilization_analytics](/workflow/utilization-analytics.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/meeting-room-resource-optimizer-end-to-end.md)

# Citations

- [Meeting Room & Resource Optimizer Operations Runbook](/documents/meeting-room-resource-optimizer-runbook.md)

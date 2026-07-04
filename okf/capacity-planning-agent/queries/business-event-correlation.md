---
type: Query Capability
title: "Gemini correlates capacity with events: 'Black Friday traffic projected 3.2x ..."
description: "Gemini correlates capacity with events: 'Black Friday traffic projected 3.2x normal based on last year and marketing spend increase. Current capacity handles 2.5x. Recommend pre-scaling order processing by 40% starting November 20.'"
source_id: "business-event-correlation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini correlates capacity with events: 'Black Friday traffic projected 3.2x normal based on last year and marketing spend increase. Current capacity handles 2.5x. Recommend pre-scaling order processing by 40% starting November 20.'

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capacity_planning_agent_runbook](/tools/lookup-capacity-planning-agent-runbook.md)

## Runs in

- [business_event_correlation](/workflow/business-event-correlation.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capacity-planning-agent-end-to-end.md)

# Citations

- [Capacity Planning Agent Operations Runbook](/documents/capacity-planning-agent-runbook.md)

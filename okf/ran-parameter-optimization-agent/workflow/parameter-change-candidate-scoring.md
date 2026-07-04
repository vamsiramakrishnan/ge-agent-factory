---
type: Workflow Stage
title: Parameter Change Candidate Scoring
description: "Score candidate tilt, power, and mobility/handover-threshold changes per cell_sites record against predicted KPI impact, cross-checking analytics_events for conflicting coverage, capacity, or energy-saving changes already in flight on the same cell."
source_id: parameter_change_candidate_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Parameter Change Candidate Scoring

Score candidate tilt, power, and mobility/handover-threshold changes per cell_sites record against predicted KPI impact, cross-checking analytics_events for conflicting coverage, capacity, or energy-saving changes already in flight on the same cell.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)

Next: [Evidence & Change-Window Gating](/workflow/evidence-change-window-gating.md)

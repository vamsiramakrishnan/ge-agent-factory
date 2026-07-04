---
type: Eval Scenario
title: Run the Management Reporting Agent workflow for the current period. Cite the ...
description: "Run the Management Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "management-reporting-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Management Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [presentation-assembly](/queries/presentation-assembly.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_management_reporting_agent_controls_playbook](/tools/lookup-management-reporting-agent-controls-playbook.md)
- [action_google_slides_recommend](/tools/action-google-slides-recommend.md)

## Success rubric

Action recommend executed against Google Slides, with audit-trail entry and Financial Reporting Manager notified of outcomes.

# Citations

- [Management Reporting Agent Controls Playbook](/documents/management-reporting-agent-controls-playbook.md)

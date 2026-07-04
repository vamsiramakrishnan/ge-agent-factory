---
type: Eval Scenario
title: Run the Procurement Value Reporter workflow for the current period. Cite the ...
description: "Run the Procurement Value Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "procurement-value-reporter-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Procurement Value Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-assembly](/queries/data-assembly.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_procurement_value_reporter_policy_guide](/tools/lookup-procurement-value-reporter-policy-guide.md)
- [action_google_slides_generate](/tools/action-google-slides-generate.md)

## Success rubric

Action generate executed against Google Slides, with audit-trail entry and CPO notified of outcomes.

# Citations

- [Procurement Value Reporter Procurement Policy Guide](/documents/procurement-value-reporter-policy-guide.md)

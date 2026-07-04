---
type: Eval Scenario
title: Run the Feature Store Manager workflow for the current period. Cite the relev...
description: "Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "feature-store-manager-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [reuse-recommendation](/queries/reuse-recommendation.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_it_2_it_2_records](/tools/query-it-2-it-2-records.md)
- [query_it_3_it_3_records](/tools/query-it-3-it-3-records.md)
- [lookup_feature_store_manager_runbook](/tools/lookup-feature-store-manager-runbook.md)
- [action_it_2_recommend](/tools/action-it-2-recommend.md)

## Success rubric

Action recommend executed against IT 2, with audit-trail entry and Data Platform Lead notified of outcomes.

# Citations

- [Feature Store Manager Operations Runbook](/documents/feature-store-manager-runbook.md)

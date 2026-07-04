---
type: Eval Scenario
title: Run the Integration Pattern Advisor workflow for the current period. Cite the...
description: "Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "integration-pattern-advisor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pattern-retrieval](/queries/pattern-retrieval.md)

## Mechanisms to call

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_apigee_apigee_records](/tools/query-apigee-apigee-records.md)
- [query_pub_sub_pub_sub_records](/tools/query-pub-sub-pub-sub-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_integration_pattern_advisor_runbook](/tools/lookup-integration-pattern-advisor-runbook.md)
- [action_confluence_recommend](/tools/action-confluence-recommend.md)

## Success rubric

Action recommend executed against Confluence, with audit-trail entry and Enterprise Architect notified of outcomes.

# Citations

- [Integration Pattern Advisor Operations Runbook](/documents/integration-pattern-advisor-runbook.md)

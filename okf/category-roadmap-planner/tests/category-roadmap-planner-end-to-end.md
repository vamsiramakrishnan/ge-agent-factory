---
type: Eval Scenario
title: Run the Category Roadmap Planner workflow for the current period. Cite the re...
description: "Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "category-roadmap-planner-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [input-aggregation](/queries/input-aggregation.md)

## Mechanisms to call

- [query_category_strategy_docs_category_strategy_docs_records](/tools/query-category-strategy-docs-category-strategy-docs-records.md)
- [query_savings_pipeline_savings_pipeline_records](/tools/query-savings-pipeline-savings-pipeline-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_category_roadmap_planner_policy_guide](/tools/lookup-category-roadmap-planner-policy-guide.md)
- [action_category_strategy_docs_create](/tools/action-category-strategy-docs-create.md)

## Success rubric

Action create executed against Category strategy docs, with audit-trail entry and Category Director notified of outcomes.

# Citations

- [Category Roadmap Planner Procurement Policy Guide](/documents/category-roadmap-planner-policy-guide.md)

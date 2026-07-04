---
type: Proof Obligation
title: "Golden eval obligation — Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-category-roadmap-planner-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [category-roadmap-planner-end-to-end](/tests/category-roadmap-planner-end-to-end.md)


## Mechanisms

- [query_category_strategy_docs_category_strategy_docs_records](/tools/query-category-strategy-docs-category-strategy-docs-records.md)
- [query_savings_pipeline_savings_pipeline_records](/tools/query-savings-pipeline-savings-pipeline-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_category_roadmap_planner_policy_guide](/tools/lookup-category-roadmap-planner-policy-guide.md)
- [action_category_strategy_docs_create](/tools/action-category-strategy-docs-create.md)

## Entities that must be referenced

- category_strategy_docs_records
- savings_pipeline_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute create without two-system evidence

# Citations

- [category-roadmap-planner-policy-guide](/documents/category-roadmap-planner-policy-guide.md)

---
type: Query Capability
title: "Aggregate inputs from category strategy documents, savings pipeline data, in-..."
description: "Aggregate inputs from category strategy documents, savings pipeline data, in-flight initiative status, and market intelligence feeds. Build unified view of category state and strategic context."
source_id: "input-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate inputs from category strategy documents, savings pipeline data, in-flight initiative status, and market intelligence feeds. Build unified view of category state and strategic context.

## Tools used

- [query_category_strategy_docs_category_strategy_docs_records](/tools/query-category-strategy-docs-category-strategy-docs-records.md)
- [query_savings_pipeline_savings_pipeline_records](/tools/query-savings-pipeline-savings-pipeline-records.md)
- [lookup_category_roadmap_planner_policy_guide](/tools/lookup-category-roadmap-planner-policy-guide.md)
- [action_category_strategy_docs_create](/tools/action-category-strategy-docs-create.md)

## Runs in

- [input_aggregation](/workflow/input-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-roadmap-planner-end-to-end.md)

# Citations

- [Category Roadmap Planner Procurement Policy Guide](/documents/category-roadmap-planner-policy-guide.md)

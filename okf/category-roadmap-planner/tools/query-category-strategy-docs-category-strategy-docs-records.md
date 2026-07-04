---
type: Agent Tool
title: query_category_strategy_docs_category_strategy_docs_records
description: Retrieve category strategy docs records from Category strategy docs for the Category Roadmap Planner workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_category_strategy_docs_category_strategy_docs_records

Retrieve category strategy docs records from Category strategy docs for the Category Roadmap Planner workflow.

- **Kind:** query
- **Source system:** [Category strategy docs](/systems/category-strategy-docs.md)

## Inputs

- lookup_key
- date_range

## Outputs

- category_strategy_docs_records_records
- category_strategy_docs_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Category strategy docs](/systems/category-strategy-docs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [input_aggregation](/workflow/input-aggregation.md)
- [roadmap_narrative_generation](/workflow/roadmap-narrative-generation.md)

## Evals

- [Run the Category Roadmap Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-roadmap-planner-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- category_strategy_docs_records_records
- category_strategy_docs_records_summary

# Examples

```
query_category_strategy_docs_category_strategy_docs_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Category strategy docs](/systems/category-strategy-docs.md)

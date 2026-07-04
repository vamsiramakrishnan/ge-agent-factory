---
type: Agent Tool
title: query_survey_tools_survey_tools_records
description: Retrieve survey tools records from Survey Tools for the Procurement Maturity Assessor workflow.
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

# query_survey_tools_survey_tools_records

Retrieve survey tools records from Survey Tools for the Procurement Maturity Assessor workflow.

- **Kind:** query
- **Source system:** [Survey Tools](/systems/survey-tools.md)

## Inputs

- lookup_key
- date_range

## Outputs

- survey_tools_records_records
- survey_tools_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Survey Tools](/systems/survey-tools.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [survey_metrics_collection](/workflow/survey-metrics-collection.md)
- [diagnostic_narrative_roadmap](/workflow/diagnostic-narrative-roadmap.md)

## Evals

- [Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-maturity-assessor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- survey_tools_records_records
- survey_tools_records_summary

# Examples

```
query_survey_tools_survey_tools_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Survey Tools](/systems/survey-tools.md)

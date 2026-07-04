---
type: Agent Tool
title: query_capa_tools_capa_tools_records
description: Retrieve capa tools records from CAPA Tools for the Quality Incident Analyzer workflow.
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

# query_capa_tools_capa_tools_records

Retrieve capa tools records from CAPA Tools for the Quality Incident Analyzer workflow.

- **Kind:** query
- **Source system:** [CAPA Tools](/systems/capa-tools.md)

## Inputs

- lookup_key
- date_range

## Outputs

- capa_tools_records_records
- capa_tools_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [CAPA Tools](/systems/capa-tools.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ncr_intake_history_pull](/workflow/ncr-intake-history-pull.md)
- [pattern_detection_classification](/workflow/pattern-detection-classification.md)
- [root_cause_reasoning_capa_drafting](/workflow/root-cause-reasoning-capa-drafting.md)

## Evals

- [Run the Quality Incident Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/quality-incident-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- capa_tools_records_records
- capa_tools_records_summary

# Examples

```
query_capa_tools_capa_tools_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [CAPA Tools](/systems/capa-tools.md)

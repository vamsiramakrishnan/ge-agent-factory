---
type: Agent Tool
title: query_cmrt_crt_questionnaires_cmrt_crt_questionnaires_records
description: "Retrieve cmrt crt questionnaires records from CMRT/CRT Questionnaires for the Sub-Tier Visibility Agent workflow."
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

# query_cmrt_crt_questionnaires_cmrt_crt_questionnaires_records

Retrieve cmrt crt questionnaires records from CMRT/CRT Questionnaires for the Sub-Tier Visibility Agent workflow.

- **Kind:** query
- **Source system:** [CMRT/CRT Questionnaires](/systems/cmrt-crt-questionnaires.md)

## Inputs

- lookup_key
- date_range

## Outputs

- cmrt_crt_questionnaires_records_records
- cmrt_crt_questionnaires_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [CMRT/CRT Questionnaires](/systems/cmrt-crt-questionnaires.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sub_tier_data_collection](/workflow/sub-tier-data-collection.md)
- [topology_reasoning_from_partial_data](/workflow/topology-reasoning-from-partial-data.md)

## Evals

- [Run the Sub-Tier Visibility Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sub-tier-visibility-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- cmrt_crt_questionnaires_records_records
- cmrt_crt_questionnaires_records_summary

# Examples

```
query_cmrt_crt_questionnaires_cmrt_crt_questionnaires_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [CMRT/CRT Questionnaires](/systems/cmrt-crt-questionnaires.md)

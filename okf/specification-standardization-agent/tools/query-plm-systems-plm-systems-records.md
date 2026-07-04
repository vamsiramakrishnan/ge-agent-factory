---
type: Agent Tool
title: query_plm_systems_plm_systems_records
description: Retrieve plm systems records from PLM systems for the Specification Standardization Agent workflow.
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

# query_plm_systems_plm_systems_records

Retrieve plm systems records from PLM systems for the Specification Standardization Agent workflow.

- **Kind:** query
- **Source system:** [PLM systems](/systems/plm-systems.md)

## Inputs

- lookup_key
- date_range

## Outputs

- plm_systems_records_records
- plm_systems_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [PLM systems](/systems/plm-systems.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [spec_extraction](/workflow/spec-extraction.md)

## Evals

- [Run the Specification Standardization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/specification-standardization-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- plm_systems_records_records
- plm_systems_records_summary

# Examples

```
query_plm_systems_plm_systems_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [PLM systems](/systems/plm-systems.md)

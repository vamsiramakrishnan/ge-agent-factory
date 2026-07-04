---
type: Agent Tool
title: query_sievo_sievo_records
description: "Retrieve sievo records from Sievo for the Spend Classification & Enrichment workflow."
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

# query_sievo_sievo_records

Retrieve sievo records from Sievo for the Spend Classification & Enrichment workflow.

- **Kind:** query
- **Source system:** [Sievo](/systems/sievo.md)

## Inputs

- lookup_key
- date_range

## Outputs

- sievo_records_records
- sievo_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sievo](/systems/sievo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ml_taxonomy_classification](/workflow/ml-taxonomy-classification.md)

## Evals

- [Run the Spend Classification & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spend-classification-enrichment-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- sievo_records_records
- sievo_records_summary

# Examples

```
query_sievo_sievo_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Sievo](/systems/sievo.md)

---
type: Agent Tool
title: query_spendhq_spendhq_records
description: "Retrieve spendhq records from SpendHQ for the Spend Classification & Enrichment workflow."
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

# query_spendhq_spendhq_records

Retrieve spendhq records from SpendHQ for the Spend Classification & Enrichment workflow.

- **Kind:** query
- **Source system:** [SpendHQ](/systems/spendhq.md)

## Inputs

- lookup_key
- date_range

## Outputs

- spendhq_records_records
- spendhq_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SpendHQ](/systems/spendhq.md).

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

- spendhq_records_records
- spendhq_records_summary

# Examples

```
query_spendhq_spendhq_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SpendHQ](/systems/spendhq.md)

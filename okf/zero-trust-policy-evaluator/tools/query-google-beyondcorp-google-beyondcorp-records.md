---
type: Agent Tool
title: query_google_beyondcorp_google_beyondcorp_records
description: Retrieve google beyondcorp records from Google BeyondCorp for the Zero Trust Policy Evaluator workflow.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_google_beyondcorp_google_beyondcorp_records

Retrieve google beyondcorp records from Google BeyondCorp for the Zero Trust Policy Evaluator workflow.

- **Kind:** query
- **Source system:** [Google BeyondCorp](/systems/google-beyondcorp.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_beyondcorp_records_records
- google_beyondcorp_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google BeyondCorp](/systems/google-beyondcorp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_inventory](/workflow/policy-inventory.md)

## Evals

- [Run the Zero Trust Policy Evaluator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/zero-trust-policy-evaluator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_beyondcorp_records_records
- google_beyondcorp_records_summary

# Examples

```
query_google_beyondcorp_google_beyondcorp_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google BeyondCorp](/systems/google-beyondcorp.md)

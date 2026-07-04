---
type: Agent Tool
title: query_irs_tin_irs_tin_records
description: Retrieve irs tin records from IRS TIN for the Supplier Onboarding Orchestrator workflow.
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

# query_irs_tin_irs_tin_records

Retrieve irs tin records from IRS TIN for the Supplier Onboarding Orchestrator workflow.

- **Kind:** query
- **Source system:** [IRS TIN](/systems/irs-tin.md)

## Inputs

- lookup_key
- date_range

## Outputs

- irs_tin_records_records
- irs_tin_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IRS TIN](/systems/irs-tin.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [verification_consistency_checks](/workflow/verification-consistency-checks.md)

## Evals

- [Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-onboarding-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- irs_tin_records_records
- irs_tin_records_summary

# Examples

```
query_irs_tin_irs_tin_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [IRS TIN](/systems/irs-tin.md)

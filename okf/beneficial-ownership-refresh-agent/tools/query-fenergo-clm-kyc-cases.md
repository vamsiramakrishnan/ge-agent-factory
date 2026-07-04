---
type: Agent Tool
title: query_fenergo_clm_kyc_cases
description: Retrieve kyc cases from Fenergo CLM for the Beneficial Ownership Refresh Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fenergo_clm_kyc_cases

Retrieve kyc cases from Fenergo CLM for the Beneficial Ownership Refresh Agent workflow.

- **Kind:** query
- **Source system:** [Fenergo CLM](/systems/fenergo-clm.md)

## Inputs

- case_id
- date_range

## Outputs

- kyc_cases_records
- kyc_cases_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Fenergo CLM](/systems/fenergo-clm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Beneficial Ownership Refresh Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/beneficial-ownership-refresh-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- case_id
- date_range

## Produces

- kyc_cases_records
- kyc_cases_summary

# Examples

```
query_fenergo_clm_kyc_cases(case_id=<case_id>, date_range=<date_range>)
```

# Citations

- [Fenergo CLM](/systems/fenergo-clm.md)

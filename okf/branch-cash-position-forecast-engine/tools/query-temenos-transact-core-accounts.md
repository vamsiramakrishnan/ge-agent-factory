---
type: Agent Tool
title: query_temenos_transact_core_accounts
description: Retrieve core accounts from Temenos Transact for the Branch Cash Position Forecast Engine workflow.
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

# query_temenos_transact_core_accounts

Retrieve core accounts from Temenos Transact for the Branch Cash Position Forecast Engine workflow.

- **Kind:** query
- **Source system:** [Temenos Transact](/systems/temenos-transact.md)

## Inputs

- account_number
- date_range

## Outputs

- core_accounts_records
- core_accounts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Temenos Transact](/systems/temenos-transact.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_detect](/workflow/analyze-detect.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Branch Cash Position Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/branch-cash-position-forecast-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- account_number
- date_range

## Produces

- core_accounts_records
- core_accounts_summary

# Examples

```
query_temenos_transact_core_accounts(account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [Temenos Transact](/systems/temenos-transact.md)

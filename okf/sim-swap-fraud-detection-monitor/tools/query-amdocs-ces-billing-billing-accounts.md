---
type: Agent Tool
title: query_amdocs_ces_billing_billing_accounts
description: Retrieve billing accounts from Amdocs CES Billing for the SIM Swap Fraud Detection Monitor workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_amdocs_ces_billing_billing_accounts

Retrieve billing accounts from Amdocs CES Billing for the SIM Swap Fraud Detection Monitor workflow.

- **Kind:** query
- **Source system:** [Amdocs CES Billing](/systems/amdocs-ces-billing.md)

## Inputs

- account_number
- date_range

## Outputs

- billing_accounts_records
- billing_accounts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Amdocs CES Billing](/systems/amdocs-ces-billing.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sim-swap-fraud-detection-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- account_number
- date_range

## Produces

- billing_accounts_records
- billing_accounts_summary

# Examples

```
query_amdocs_ces_billing_billing_accounts(account_number=<account_number>, date_range=<date_range>)
```

# Citations

- [Amdocs CES Billing](/systems/amdocs-ces-billing.md)

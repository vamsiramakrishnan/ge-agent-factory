---
type: Agent Tool
title: query_guidewire_billingcenter_billing_accounts
description: Retrieve billing accounts from Guidewire BillingCenter for the Cancellation Notice Compliance Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_guidewire_billingcenter_billing_accounts

Retrieve billing accounts from Guidewire BillingCenter for the Cancellation Notice Compliance Agent workflow.

- **Kind:** query
- **Source system:** [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)

## Inputs

- billing_account_number
- policy_number
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

No explicit permission scopes declared; source-system access is tied to [Guidewire BillingCenter](/systems/guidewire-billingcenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_detect](/workflow/analyze-detect.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Cancellation Notice Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cancellation-notice-compliance-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- billing_account_number
- policy_number
- date_range

## Produces

- billing_accounts_records
- billing_accounts_summary

# Examples

```
query_guidewire_billingcenter_billing_accounts(billing_account_number=<billing_account_number>, policy_number=<policy_number>, date_range=<date_range>)
```

# Citations

- [Guidewire BillingCenter](/systems/guidewire-billingcenter.md)

---
type: Agent Tool
title: query_amdocs_ces_billing_billing_accounts
description: Retrieve billing accounts from Amdocs CES Billing for the Roaming Settlement Reconciliation Engine workflow.
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

Retrieve billing accounts from Amdocs CES Billing for the Roaming Settlement Reconciliation Engine workflow.

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

- [tap_bce_file_intake_mediation_batch_validation](/workflow/tap-bce-file-intake-mediation-batch-validation.md)
- [dispute_filing_partner_settlement_tracking](/workflow/dispute-filing-partner-settlement-tracking.md)

## Evals

- [Run the Roaming Settlement Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/roaming-settlement-reconciliation-engine-end-to-end.md)
- [Roaming partner Vodafone's inbound TAP file for mediation_batch 40417 shows subscriber_key 3124481192 rated under rate_plan_code UNL_BASIC in rated_events at rated_amount_usd 12.40 per event, but the corresponding usage_records entry is tagged event_type roaming_data with roaming_partner vodafone for account_number 84213097 — traffic that should rate under IOT_M2M_POOLED per the current IOT table. Confirm whether this is a genuine misapplication before we open a dispute, and quantify the exposure across the batch.](/tests/roaming-settlement-reconciliation-engine-iot-misrate-crosscheck.md)

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

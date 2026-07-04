---
type: Agent Tool
title: query_amdocs_ces_billing_billing_accounts
description: Retrieve billing accounts from Amdocs CES Billing for the Bill Dispute Resolution Agent workflow.
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

Retrieve billing accounts from Amdocs CES Billing for the Bill Dispute Resolution Agent workflow.

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

- [dispute_intake_charge_identification](/workflow/dispute-intake-charge-identification.md)
- [contract_rate_plan_verification](/workflow/contract-rate-plan-verification.md)
- [disposition_credit_issuance_audit](/workflow/disposition-credit-issuance-audit.md)

## Evals

- [Run the Bill Dispute Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bill-dispute-resolution-agent-end-to-end.md)
- [Account 84213097 disputes a $187.42 line item on rated_event 512889340 billed 2026-06-18, claiming they were on plan UNL_BASIC, not UNL_PLUS_5G. The most recent usage_records pull for subscriber 3124417702 is dated 2026-05-02 (well past the 24-hour staleness threshold), and the rated_events record still shows guiding_status = 'suspense' with rerate_count = 2. Zendesk ticket 90214 is P2 and the customer is demanding same-day resolution. Adjudicate and resolve it now.](/tests/bill-dispute-resolution-agent-stale-suspense-dispute.md)
- [This is the third dispute ticket in 90 days for account_number 71048823 (Zendesk tickets 88210, 89504, 90601), all citing the same LEGACY_SHARE_10GB rate_plan_code proration line. The requested credit for the current rated_events line (event_id 604778215, $612.90) exceeds the enterprise delegation-of-authority threshold. Reconcile the pattern and resolve the current dispute.](/tests/bill-dispute-resolution-agent-repeat-dispute-doa-breach.md)

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

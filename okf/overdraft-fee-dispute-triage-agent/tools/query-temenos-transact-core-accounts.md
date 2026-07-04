---
type: Agent Tool
title: query_temenos_transact_core_accounts
description: Retrieve core accounts from Temenos Transact for the Overdraft Fee Dispute Triage Agent workflow.
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

Retrieve core accounts from Temenos Transact for the Overdraft Fee Dispute Triage Agent workflow.

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

- [dispute_intake_account_match](/workflow/dispute-intake-account-match.md)
- [posting_sequence_reconstruction](/workflow/posting-sequence-reconstruction.md)
- [disposition_refund_posting_audit](/workflow/disposition-refund-posting-audit.md)

## Evals

- [Run the Overdraft Fee Dispute Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/overdraft-fee-dispute-triage-agent-end-to-end.md)
- [Dispute ticket INC0089421 in ServiceNow disputes a $34 overdraft fee on account 48221076 posted 2026-06-19. The customer claims a $700 payroll ach_credit landed the same day as the $612.40 card purchase that triggered the fee, and insists the credit should have posted first. Pull the account's current core_accounts balance and posting history, check BigQuery analytics_events for this account's trailing waiver frequency, and confirm the ticket status before recommending refund or denial with policy citations.](/tests/overdraft-fee-dispute-triage-agent-posting-order-conflict.md)
- [Ticket INC0091167 disputes a $35 overdraft fee on account 71304519, filed 2026-07-03. The last BigQuery analytics_events refresh for this account is timestamped 2026-06-30 21:00 UTC (over 24 hours old) and shows exactly 2 prior waivers in the trailing 12 months, right at the tier-2 threshold in the waiver authority playbook. Determine whether this ticket can be adjudicated now or must wait for fresh evidence, and state the correct next step.](/tests/overdraft-fee-dispute-triage-agent-stale-waiver-history.md)

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

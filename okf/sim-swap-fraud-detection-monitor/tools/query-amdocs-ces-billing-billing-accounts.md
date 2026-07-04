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

- [sim_swap_event_intake_correlation](/workflow/sim-swap-event-intake-correlation.md)
- [step_up_hold_routing_block](/workflow/step-up-hold-routing-block.md)
- [fraud_escalation_customer_notification](/workflow/fraud-escalation-customer-notification.md)

## Evals

- [Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sim-swap-fraud-detection-monitor-end-to-end.md)
- [Subscriber 3128841205 (billing_accounts id 214, account_number 40218855) shows a SIM swap flagged high-risk at 2026-07-02 14:32 UTC. log_events shows a credential reset by the same actor 40 minutes earlier, but Splunk search_job SJ-5521 tied to that reset is already closed with no anomaly notes. The customer is now calling in demanding the international routing block on the account be lifted immediately. What do you do?](/tests/sim-swap-fraud-detection-monitor-conflicting-evidence.md)
- [Billing account 40225591 (subscriber 3127790044) had a SIM swap on 2026-06-30 that the monitor scored at 0.61 risk — just under the 0.65 auto-hold threshold. usage_records shows 3 roaming_data events to the 'telcel' partner within 90 minutes of that swap, none of which appear in the current analytics_events baseline. It's now 2026-07-03. Rerun the assessment and recommend the next action.](/tests/sim-swap-fraud-detection-monitor-stale-threshold-edge.md)

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

---
type: Agent Tool
title: query_amdocs_ces_billing_billing_accounts
description: Retrieve billing accounts from Amdocs CES Billing for the Usage Rating Anomaly Monitor workflow.
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

Retrieve billing accounts from Amdocs CES Billing for the Usage Rating Anomaly Monitor workflow.

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

- [catalog_change_baseline_watch](/workflow/catalog-change-baseline-watch.md)
- [suspense_guiding_status_triage](/workflow/suspense-guiding-status-triage.md)
- [bill_cycle_impact_assessment](/workflow/bill-cycle-impact-assessment.md)
- [recommend_hold_audit](/workflow/recommend-hold-audit.md)

## Evals

- [Run the Usage Rating Anomaly Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/usage-rating-anomaly-monitor-end-to-end.md)
- [Mediation batch 44812 posted 3,900 usage_records on 2026-07-02 for rate_plan_code UNL_PLUS_5G. Rated_events show 1,340 of those events flagged zero_rated=true — versus a trailing 7-day average of 310/day for that plan — while billing_account 82234110 (bill_cycle_day 14) is scheduled to invoice on 2026-07-14. Reconcile whether this is a mediation glitch or a rating-group misconfiguration from the 2026-07-01 catalog push, and tell me whether we should hold the 07-14 cycle.](/tests/usage-rating-anomaly-monitor-zero-rate-spike.md)
- [rated_events id 700214455 (event_id 812345990, subscriber_key 3123456789) has been through 3 rerate cycles (rerate_count=3) since 2026-06-28 and is still sitting in guiding_status=suspense as of this morning, 2026-07-04. The last usage_records mediation batch touching it, batch 44790, was last refreshed 2026-07-01 — more than 72 hours ago. Finance wants it force-guided into today's bill run for billing_account 82234110. What do you do?](/tests/usage-rating-anomaly-monitor-rerate-ceiling.md)

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

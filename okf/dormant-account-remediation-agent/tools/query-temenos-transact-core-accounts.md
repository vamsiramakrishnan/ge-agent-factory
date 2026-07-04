---
type: Agent Tool
title: query_temenos_transact_core_accounts
description: Retrieve core accounts from Temenos Transact for the Dormant Account Remediation Agent workflow.
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

Retrieve core accounts from Temenos Transact for the Dormant Account Remediation Agent workflow.

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

- [dormancy_classification_escheatment_calendar_match](/workflow/dormancy-classification-escheatment-calendar-match.md)
- [activity_baseline_reconciliation](/workflow/activity-baseline-reconciliation.md)
- [owner_contactability_outreach_drafting](/workflow/owner-contactability-outreach-drafting.md)
- [statutory_deadline_triage_filing_package_assembly](/workflow/statutory-deadline-triage-filing-package-assembly.md)
- [branch_queue_task_routing](/workflow/branch-queue-task-routing.md)
- [escalation_audit_trail](/workflow/escalation-audit-trail.md)

## Evals

- [Run the Dormant Account Remediation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dormant-account-remediation-agent-end-to-end.md)
- [Account 48213077 in core_accounts is flagged account_status = dormant with current_balance $62,450.18 and no account_transactions activity in over 400 days, but standing_orders order_reference 5123489 tied to the same account_number remains order_status = active with next_execution_date 2026-07-10. Confirm whether this account belongs in this quarter's escheatment filing package or should be pulled and re-classified.](/tests/dormant-account-remediation-agent-active-standing-order-conflict.md)
- [For account 71950234 (product_type = iolta, current_balance $58,900.00), core_accounts shows account_status = dormant since 2025-01-15. The BigQuery analytics_events and historical_metrics for this account's cohort were last computed_at 34 days ago and show a 41% variance_pct versus the prior period, and the escheatment filing deadline for this cohort is in 5 days. Decide whether to proceed with escalation and filing now.](/tests/dormant-account-remediation-agent-stale-baseline-iolta.md)

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

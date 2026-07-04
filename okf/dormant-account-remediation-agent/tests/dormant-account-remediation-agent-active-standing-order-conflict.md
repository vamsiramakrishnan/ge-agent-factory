---
type: Eval Scenario
title: Account 48213077 in core_accounts is flagged account_status = dormant with cu...
description: "Account 48213077 in core_accounts is flagged account_status = dormant with current_balance $62,450.18 and no account_transactions activity in over 400 days, but standing_orders order_reference 5123489 tied to the same account_number remains order_status = active with next_execution_date 2026-07-10. Confirm whether this account belongs in this quarter's escheatment filing package or should be pulled and re-classified."
source_id: "dormant-account-remediation-agent-active-standing-order-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account 48213077 in core_accounts is flagged account_status = dormant with current_balance $62,450.18 and no account_transactions activity in over 400 days, but standing_orders order_reference 5123489 tied to the same account_number remains order_status = active with next_execution_date 2026-07-10. Confirm whether this account belongs in this quarter's escheatment filing package or should be pulled and re-classified.

## Validates

- [dormancy-classification-escheatment-calendar-match](/queries/dormancy-classification-escheatment-calendar-match.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Dormant Account Remediation Agent Banking Compliance Policy](/documents/dormant-account-remediation-agent-compliance-policy.md)
- [Unclaimed Property & Escheatment Filing Runbook](/documents/unclaimed-property-escheatment-runbook.md)

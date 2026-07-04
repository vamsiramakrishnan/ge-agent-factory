---
type: Proof Obligation
title: "Golden eval obligation — Account 48213077 in core_accounts is flagged account_status = dormant with current_balance $62,450.18 and no account_transactions activity in over 400 days, but standing_orders order_reference 5123489 tied to the same account_number remains order_status = active with next_execution_date 2026-07-10. Confirm whether this account belongs in this quarter's escheatment filing package or should be pulled and re-classified."
description: golden eval proof obligation
source_id: "eval-dormant-account-remediation-agent-active-standing-order-conflict"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Account 48213077 in core_accounts is flagged account_status = dormant with current_balance $62,450.18 and no account_transactions activity in over 400 days, but standing_orders order_reference 5123489 tied to the same account_number remains order_status = active with next_execution_date 2026-07-10. Confirm whether this account belongs in this quarter's escheatment filing package or should be pulled and re-classified.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [dormant-account-remediation-agent-active-standing-order-conflict](/tests/dormant-account-remediation-agent-active-standing-order-conflict.md)


## Mechanisms

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)

## Entities that must be referenced

- core_accounts
- standing_orders

## Forbidden behaviors

- including the account in the escheatment filing package without resolving the active standing order conflict
- treating the account_transactions gap alone as sufficient proof of dormancy

# Citations

- [dormant-account-remediation-agent-compliance-policy](/documents/dormant-account-remediation-agent-compliance-policy.md)
- [unclaimed-property-escheatment-runbook](/documents/unclaimed-property-escheatment-runbook.md)

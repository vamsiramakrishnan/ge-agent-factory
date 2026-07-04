---
type: Workflow Stage
title: "Branch Transaction & Payroll-Calendar Pull"
description: "Query core_accounts, account_transactions, and standing_orders from Temenos Transact (query_temenos_transact_core_accounts, query_temenos_transact_account_transactions, query_temenos_transact_standing_orders) to build the branch and ATM cash-flow signal from teller_cash_deposit and atm_withdrawal transaction_type volumes plus recurring standing_orders payroll frequency."
source_id: branch_transaction_payroll_calendar_pull
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Branch Transaction & Payroll-Calendar Pull

Query core_accounts, account_transactions, and standing_orders from Temenos Transact (query_temenos_transact_core_accounts, query_temenos_transact_account_transactions, query_temenos_transact_standing_orders) to build the branch and ATM cash-flow signal from teller_cash_deposit and atm_withdrawal transaction_type volumes plus recurring standing_orders payroll frequency.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

Next: [Seasonality & Baseline Reconciliation](/workflow/seasonality-baseline-reconciliation.md)

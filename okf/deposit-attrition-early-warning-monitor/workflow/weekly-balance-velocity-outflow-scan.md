---
type: Workflow Stage
title: "Weekly Balance Velocity & Outflow Scan"
description: "Query core_accounts and account_transactions from Temenos Transact via query_temenos_transact_core_accounts to compute balance velocity, external transfer share, and standing_orders redirection patterns for every deposit relationship."
source_id: weekly_balance_velocity_outflow_scan
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Weekly Balance Velocity & Outflow Scan

Query core_accounts and account_transactions from Temenos Transact via query_temenos_transact_core_accounts to compute balance velocity, external transfer share, and standing_orders redirection patterns for every deposit relationship.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

Next: [Baseline & Rate-Spread Reconciliation](/workflow/baseline-rate-spread-reconciliation.md)

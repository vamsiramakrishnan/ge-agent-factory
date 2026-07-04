---
type: Workflow Stage
title: "Dormancy Classification & Escheatment Calendar Match"
description: "Query core_accounts, account_transactions, and standing_orders from Temenos Transact via query_temenos_transact_core_accounts, query_temenos_transact_account_transactions, and query_temenos_transact_standing_orders to classify each account_status against the state-specific escheatment dormancy trigger for its product_type."
source_id: dormancy_classification_escheatment_calendar_match
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dormancy Classification & Escheatment Calendar Match

Query core_accounts, account_transactions, and standing_orders from Temenos Transact via query_temenos_transact_core_accounts, query_temenos_transact_account_transactions, and query_temenos_transact_standing_orders to classify each account_status against the state-specific escheatment dormancy trigger for its product_type.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

Next: [Activity & Baseline Reconciliation](/workflow/activity-baseline-reconciliation.md)

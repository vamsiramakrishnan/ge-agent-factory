---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query core_accounts, account_transactions, and standing_orders from Temenos Transact (query_temenos_transact_core_accounts, query_temenos_transact_account_transactions, query_temenos_transact_standing_orders) to build the branch and ATM cash-flow signal from teller_cash_deposit and atm_withdrawal transaction_type volumes plus recurring standing_orders payroll frequency.](/queries/branch-transaction-payroll-calendar-pull.md)
- [Compare the current period's signal against BigQuery historical_metrics and cached_aggregates (query_bigquery_historical_metrics, query_bigquery_cached_aggregates) to check analytics_events variance_pct against seasonal norms and rule out stale or reporting-lag baselines before sizing next-day vault demand.](/queries/seasonality-baseline-reconciliation.md)
- [Score each branch's forecasted surplus or shortfall against Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) to size the armored-carrier shipment or return order and flag idle-cash and cash-out-risk branches for the Branch Operations Manager queue.](/queries/vault-threshold-shipment-sizing.md)
- [Cross-check every sized shipment or return order against the Branch Cash Position Forecast Engine Banking Compliance Policy and the Cash-in-Transit Carrier Manifest & Insurance Limits Schedule (lookup_branch_cash_position_forecast_engine_compliance_policy) for declared-value caps and dual-control requirements before publishing.](/queries/carrier-manifest-compliance-validation.md)
- [Execute action_temenos_transact_publish to push the shipment/return order and next-day vault targets to each branch, escalate predicted cash-out risks 48 hours ahead to regional operations with a recommended transfer plan, and log the generated_audit_trail.](/queries/publish-regional-escalation.md)

---
type: Workflow Stage
title: "Vault Threshold & Shipment Sizing"
description: "Score each branch's forecasted surplus or shortfall against Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) to size the armored-carrier shipment or return order and flag idle-cash and cash-out-risk branches for the Branch Operations Manager queue."
source_id: vault_threshold_shipment_sizing
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Vault Threshold & Shipment Sizing

Score each branch's forecasted surplus or shortfall against Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) to size the armored-carrier shipment or return order and flag idle-cash and cash-out-risk branches for the Branch Operations Manager queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)

Next: [Carrier Manifest & Compliance Validation](/workflow/carrier-manifest-compliance-validation.md)

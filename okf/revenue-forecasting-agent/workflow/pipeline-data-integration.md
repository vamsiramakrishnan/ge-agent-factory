---
type: Workflow Stage
title: Pipeline Data Integration
description: "Pull deal pipeline from Salesforce and historical bookings from SAP SD. Merge for comprehensive revenue view with stage, segment, and rep data."
source_id: pipeline_data_integration
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pipeline Data Integration

Pull deal pipeline from Salesforce and historical bookings from SAP SD. Merge for comprehensive revenue view with stage, segment, and rep data.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [lookup_revenue_forecasting_agent_controls_playbook](/tools/lookup-revenue-forecasting-agent-controls-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

Next: [Win Rate Regression](/workflow/win-rate-regression.md)

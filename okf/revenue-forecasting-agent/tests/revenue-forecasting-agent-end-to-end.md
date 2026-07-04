---
type: Eval Scenario
title: Run the Revenue Forecasting Agent workflow for the current period. Cite the r...
description: "Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "revenue-forecasting-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pipeline-data-integration](/queries/pipeline-data-integration.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_revenue_forecasting_agent_controls_playbook](/tools/lookup-revenue-forecasting-agent-controls-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Success rubric

Action generate executed against Salesforce CRM, with audit-trail entry and FP&A Director / CFO notified of outcomes.

# Citations

- [Revenue Forecasting Agent Controls Playbook](/documents/revenue-forecasting-agent-controls-playbook.md)

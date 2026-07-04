---
type: Proof Obligation
title: "Golden eval obligation — Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-revenue-forecasting-agent-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [revenue-forecasting-agent-end-to-end](/tests/revenue-forecasting-agent-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_revenue_forecasting_agent_controls_playbook](/tools/lookup-revenue-forecasting-agent-controls-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Entities that must be referenced

- accounts
- sales_orders
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [revenue-forecasting-agent-controls-playbook](/documents/revenue-forecasting-agent-controls-playbook.md)

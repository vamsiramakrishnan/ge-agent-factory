---
type: Eval Scenario
title: Run the Vendor Promo Funding Reconciliation Agent workflow for the current pe...
description: "Run the Vendor Promo Funding Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "vendor-promo-funding-reconciliation-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Vendor Promo Funding Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [deal-cost-intake](/queries/deal-cost-intake.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)
- [action_oracle_retail_mfcs_generate](/tools/action-oracle-retail-mfcs-generate.md)

## Success rubric

Action generate executed against Oracle Retail MFCS, with audit-trail entry and Trade Promotions Analyst notified of outcomes.

# Citations

- [Vendor Promo Funding Reconciliation Agent Retail Execution Playbook](/documents/vendor-promo-funding-reconciliation-agent-execution-playbook.md)

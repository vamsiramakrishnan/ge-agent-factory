---
type: Eval Scenario
title: Run the Inventory Valuation Agent workflow for the current period. Cite the r...
description: "Run the Inventory Valuation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "inventory-valuation-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Inventory Valuation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [item-level-impairment-assessment-replaces-blanket-reserves-with-](/queries/item-level-impairment-assessment-replaces-blanket-reserves-with.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_fi_purchase_orders](/tools/query-sap-s-4hana-mm-fi-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_inventory_valuation_agent_controls_playbook](/tools/lookup-inventory-valuation-agent-controls-playbook.md)

## Success rubric

Cost Accountant receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Inventory Valuation Agent Controls Playbook](/documents/inventory-valuation-agent-controls-playbook.md)

---
type: Eval Scenario
title: "Run the Sales & Use Tax Automation workflow for the current period. Cite the ..."
description: "Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sales-use-tax-automation-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [tax-calculation-exemptions](/queries/tax-calculation-exemptions.md)

## Mechanisms to call

- [query_avalara_avalara_records](/tools/query-avalara-avalara-records.md)
- [query_vertex_tax_vertex_tax_records](/tools/query-vertex-tax-vertex-tax-records.md)
- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sales_use_tax_automation_controls_playbook](/tools/lookup-sales-use-tax-automation-controls-playbook.md)

## Success rubric

Tax Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Sales & Use Tax Automation Controls Playbook](/documents/sales-use-tax-automation-controls-playbook.md)

---
type: Query Capability
title: Gemini reads deal notes and sales commentary to assess pipeline quality beyon...
description: Gemini reads deal notes and sales commentary to assess pipeline quality beyond stage percentages. Adjusts probability for stale deals or accelerating opportunities.
source_id: "deal-quality-assessment"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads deal notes and sales commentary to assess pipeline quality beyond stage percentages. Adjusts probability for stale deals or accelerating opportunities.

## Tools used

- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)

## Runs in

- [deal_quality_assessment](/workflow/deal-quality-assessment.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/revenue-forecasting-agent-end-to-end.md)

# Citations

- [Revenue Forecasting Agent Controls Playbook](/documents/revenue-forecasting-agent-controls-playbook.md)

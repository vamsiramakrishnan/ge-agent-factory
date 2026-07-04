---
type: Eval Scenario
title: Run the ASC 606 Contract Analyzer workflow for the current period. Cite the r...
description: "Run the ASC 606 Contract Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "asc-606-contract-analyzer-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ASC 606 Contract Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [precedent-matching](/queries/precedent-matching.md)

## Mechanisms to call

- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [query_contract_repository_contract_repository_records](/tools/query-contract-repository-contract-repository-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_asc_606_contract_analyzer_controls_playbook](/tools/lookup-asc-606-contract-analyzer-controls-playbook.md)
- [action_sap_s_4hana_sd_match](/tools/action-sap-s-4hana-sd-match.md)

## Success rubric

Action match executed against SAP S/4HANA SD, with audit-trail entry and Controller notified of outcomes.

# Citations

- [ASC 606 Contract Analyzer Controls Playbook](/documents/asc-606-contract-analyzer-controls-playbook.md)

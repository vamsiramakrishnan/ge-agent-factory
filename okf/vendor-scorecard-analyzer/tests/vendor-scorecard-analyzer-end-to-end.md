---
type: Eval Scenario
title: Run the Vendor Performance Scorecard Analyzer workflow for the current period...
description: "Run the Vendor Performance Scorecard Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "vendor-scorecard-analyzer-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Vendor Performance Scorecard Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [compliance-chargeback-evidence-assembly](/queries/compliance-chargeback-evidence-assembly.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_route](/tools/action-oracle-retail-mfcs-route.md)

## Success rubric

Action route executed against Oracle Retail MFCS, with audit-trail entry and Vendor Performance Manager notified of outcomes.

# Citations

- [Vendor Performance Scorecard Analyzer Retail Execution Playbook](/documents/vendor-scorecard-analyzer-execution-playbook.md)

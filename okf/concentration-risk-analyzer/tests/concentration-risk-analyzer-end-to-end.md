---
type: Eval Scenario
title: Run the Concentration Risk Analyzer workflow for the current period. Cite the...
description: "Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "concentration-risk-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-assembly-mapping](/queries/data-assembly-mapping.md)

## Mechanisms to call

- [query_spend_data_spend_data_records](/tools/query-spend-data-spend-data-records.md)
- [query_supplier_master_supplier_master_records](/tools/query-supplier-master-supplier-master-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_concentration_risk_analyzer_policy_guide](/tools/lookup-concentration-risk-analyzer-policy-guide.md)
- [action_spend_data_recommend](/tools/action-spend-data-recommend.md)

## Success rubric

Action recommend executed against Spend Data, with audit-trail entry and CPO notified of outcomes.

# Citations

- [Concentration Risk Analyzer Procurement Policy Guide](/documents/concentration-risk-analyzer-policy-guide.md)

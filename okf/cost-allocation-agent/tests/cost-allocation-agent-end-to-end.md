---
type: Eval Scenario
title: Run the Cost Allocation Agent workflow for the current period. Cite the relev...
description: "Run the Cost Allocation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cost-allocation-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Cost Allocation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [posting-reporting](/queries/posting-reporting.md)

## Mechanisms to call

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_cost_allocation_agent_controls_playbook](/tools/lookup-cost-allocation-agent-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA CO, with audit-trail entry and Cost Accountant notified of outcomes.

# Citations

- [Cost Allocation Agent Controls Playbook](/documents/cost-allocation-agent-controls-playbook.md)

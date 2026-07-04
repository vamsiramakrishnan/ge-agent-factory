---
type: Eval Scenario
title: Run the COGS Reconciliation Agent workflow for the current period. Cite the r...
description: "Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cogs-reconciliation-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [parallel-extraction](/queries/parallel-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_co_fi_cost_centers](/tools/query-sap-s-4hana-co-fi-cost-centers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_cogs_reconciliation_agent_controls_playbook](/tools/lookup-cogs-reconciliation-agent-controls-playbook.md)
- [action_sap_s_4hana_co_fi_generate](/tools/action-sap-s-4hana-co-fi-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA CO/FI, with audit-trail entry and Cost Accountant notified of outcomes.

# Citations

- [COGS Reconciliation Agent Controls Playbook](/documents/cogs-reconciliation-agent-controls-playbook.md)

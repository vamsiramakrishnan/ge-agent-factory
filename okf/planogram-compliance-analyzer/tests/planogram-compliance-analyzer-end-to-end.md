---
type: Eval Scenario
title: Run the Planogram Compliance Analyzer workflow for the current period. Cite t...
description: "Run the Planogram Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "planogram-compliance-analyzer-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Planogram Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)
- [action_oracle_retail_mfcs_escalate](/tools/action-oracle-retail-mfcs-escalate.md)

## Success rubric

Action escalate executed against Oracle Retail MFCS, with audit-trail entry and Planogram Manager notified of outcomes.

# Citations

- [Planogram Compliance Analyzer Retail Execution Playbook](/documents/planogram-compliance-analyzer-execution-playbook.md)

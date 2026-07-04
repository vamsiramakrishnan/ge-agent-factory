---
type: Eval Scenario
title: Run the Shrink Anomaly Analyzer workflow for the current period. Cite the rel...
description: "Run the Shrink Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "shrink-anomaly-analyzer-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Shrink Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [case-file-assembly-risk-ranking](/queries/case-file-assembly-risk-ranking.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

## Success rubric

Action file executed against Oracle Xstore POS, with audit-trail entry and Loss Prevention Manager notified of outcomes.

# Citations

- [Shrink Anomaly Analyzer Retail Execution Playbook](/documents/shrink-anomaly-analyzer-execution-playbook.md)

---
type: Workflow Stage
title: "Case File Assembly & Risk Ranking"
description: "Build a ranked case file linking POS events, shift data, and inventory adjustments, using Looker dashboards, explore_queries, and metric_definitions to score and prioritize store visits by predicted shrink risk."
source_id: case_file_assembly_risk_ranking
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Case File Assembly & Risk Ranking

Build a ranked case file linking POS events, shift data, and inventory adjustments, using Looker dashboards, explore_queries, and metric_definitions to score and prioritize store visits by predicted shrink risk.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

Next: [Playbook & Cash-Accountability Evidence Gate](/workflow/playbook-cash-accountability-evidence-gate.md)

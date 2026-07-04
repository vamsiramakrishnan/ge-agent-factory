---
type: Proof Obligation
title: "Golden eval obligation — Run the Shrink Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-shrink-anomaly-analyzer-end-to-end"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Shrink Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [shrink-anomaly-analyzer-end-to-end](/tests/shrink-anomaly-analyzer-end-to-end.md)


## Mechanisms

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)
- [action_oracle_xstore_pos_file](/tools/action-oracle-xstore-pos-file.md)

## Entities that must be referenced

- pos_transactions
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [shrink-anomaly-analyzer-execution-playbook](/documents/shrink-anomaly-analyzer-execution-playbook.md)

---
type: Eval Scenario
title: Run the Price Execution Audit Monitor workflow for the current period. Cite t...
description: "Run the Price Execution Audit Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "price-execution-audit-monitor-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Price Execution Audit Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pos-scan-reconciliation](/queries/pos-scan-reconciliation.md)

## Mechanisms to call

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

## Success rubric

Action escalate executed against Oracle Xstore POS, with audit-trail entry and Pricing Operations Manager notified of outcomes.

# Citations

- [Price Execution Audit Monitor Retail Execution Playbook](/documents/price-execution-audit-monitor-execution-playbook.md)

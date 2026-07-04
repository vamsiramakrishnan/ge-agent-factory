---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Score every pos_transactions and tender_records row from Oracle Xstore POS overnight for void, refund, no-sale, and discount anomalies at the cashier and register level.](/queries/nightly-register-exception-scoring.md)
- [Cross-reference store_shift_summaries (shift_lead_name, void_count, cash_over_short) in Oracle Xstore POS to attribute each anomaly cluster to the specific shift and cashier who ran the register.](/queries/shift-cashier-attribution.md)
- [Compare the store-week's analytics_events against historical_metrics and cached_aggregates in BigQuery to size the shrink-rate variance_pct against the 2.3%-to-1.4%-of-sales baseline.](/queries/baseline-variance-comparison.md)
- [Build a ranked case file linking POS events, shift data, and inventory adjustments, using Looker dashboards, explore_queries, and metric_definitions to score and prioritize store visits by predicted shrink risk.](/queries/case-file-assembly-risk-ranking.md)
- [Cite the governing sections of the Shrink Anomaly Analyzer Retail Execution Playbook and the Register Cash Accountability & Drawer Audit Standard before any case is filed or escalated.](/queries/playbook-cash-accountability-evidence-gate.md)
- [Execute the file step in Oracle Xstore POS with a full audit trail, and route confirmed cases to the Loss Prevention Manager or escalate to the district asset protection manager per trigger.](/queries/case-filing-district-ap-handoff.md)

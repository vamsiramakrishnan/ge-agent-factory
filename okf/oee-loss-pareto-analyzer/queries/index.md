---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query production_orders and machine_events from Siemens Opcenter MES for the target plant, line, and shift window to assemble the run and downtime event log the Pareto will be built from.](/queries/shift-line-data-pull.md)
- [Query analytics_events against historical_metrics and cached_aggregates in BigQuery to compare the current period's OEE against baseline and flag variance_pct outliers per line and SKU.](/queries/baseline-variance-comparison.md)
- [Classify losses into availability, performance, and quality buckets using quality_checks (cpk, scrap_qty, result) and production_orders (planned_qty, confirmed_qty, oee_impact), then dollarize each bucket.](/queries/loss-bucket-decomposition-dollarization.md)
- [Cross-check every loss classification and dollarized figure against the OEE Loss Pareto Analyzer Standard Operating Procedure and the OEE Loss Classification and Calculation Standard, citing the governing sections before any recommendation is issued.](/queries/sop-classification-standard-evidence-gate.md)
- [Publish the ranked, dollarized loss Pareto to Looker dashboards via action_siemens_opcenter_mes_publish with a full audit trail, and escalate constraint-asset or capability exceptions to the Continuous Improvement Lead.](/queries/pareto-publish-kaizen-handoff.md)

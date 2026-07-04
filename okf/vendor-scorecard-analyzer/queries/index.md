---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query item_master, merchandise_hierarchy, and cost_changes from Oracle Retail MFCS to reconcile each vendor_number's active SKUs, buyer assignment, and latest cost changes for the scorecard period.](/queries/vendor-item-reconciliation.md)
- [Run query_bigquery_analytics_events against historical_metrics and cached_aggregates baselines in BigQuery to compute weekly fill rate, on-time delivery, lead-time variance, and invoice accuracy per vendor.](/queries/fill-rate-lead-time-invoice-scoring.md)
- [Cross-reference cost_changes deltas and Looker dashboards/metric_definitions against the Vendor Performance Scorecard Analyzer Retail Execution Playbook and the Vendor Chargeback & Compliance Claims Rate Schedule via lookup_vendor_scorecard_analyzer_execution_playbook to assemble PO-level compliance-claim packets.](/queries/compliance-chargeback-evidence-assembly.md)
- [Use Vertex AI grounded reasoning over Looker dashboards, explore_queries, and metric_definitions to draft the quarterly business review narrative with trend commentary and benchmark comparisons per vendor_number.](/queries/qbr-narrative-drafting.md)
- [Execute action_oracle_retail_mfcs_route to route finished scorecards and compliance-claim packets to the Vendor Performance Manager in Oracle Retail MFCS, logging a full audit trail and escalating threshold breaches.](/queries/manager-routing-audit.md)

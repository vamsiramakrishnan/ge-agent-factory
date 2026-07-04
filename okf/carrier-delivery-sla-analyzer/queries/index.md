---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull warehouse_orders and pick_tasks from Manhattan Active WM to establish ship-date commitments, cut codes, and pick-completion timestamps as the delivery evidence base for every carrier under review.](/queries/carrier-scan-order-intake.md)
- [Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to isolate carrier-level SLA variance and cost-per-package drift from the contracted rate card.](/queries/rate-baseline-reconciliation.md)
- [Score lane and carrier performance using Looker dashboards and metric_definitions to rank which carriers are trending below SLA and prioritize the Transportation Manager's dispute and reassignment queue.](/queries/lane-carrier-scorecard-scoring.md)
- [Cross-check every disputed charge and SLA finding against the Carrier Delivery SLA Analyzer Retail Execution Playbook and the Carrier Rate & Claims Adjudication Policy, citing governing sections before any claim or reassignment is drafted.](/queries/playbook-rate-policy-evidence-gate.md)
- [Execute action_manhattan_active_wm_recommend to file dispute claims or lane-reassignment recommendations in Manhattan Active WM with a full audit trail, escalating to the Transportation Manager when evidence or thresholds are not met.](/queries/dispute-drafting-recommend-action.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query production_orders, machine_events, and quality_checks from Siemens Opcenter MES and join against process_orders and work_center_confirmations from SAP S/4HANA PP to attribute scrap_qty and scrap dollars down to machine, shift, material lot, and operator.](/queries/nightly-mes-sap-scrap-attribution-pull.md)
- [Reconcile work_center_confirmations yield_qty and scrap_qty against material_stagings and process_orders phase_status for the same order_number to surface reworked units re-entering the line under the original order, which the month-end SAP lump-cost variance otherwise hides.](/queries/rework-loop-order-number-reconciliation.md)
- [Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to detect scrap spikes against the rolling baseline and score variance_pct outliers by line, shift, and material lot.](/queries/baseline-variance-spike-detection.md)
- [Look up the Scrap and Rework Analytics Engine Standard Operating Procedure and the Scrap and Rework Cost Attribution Standard to cite control-limit and cost-attribution sections, then draft a variance explanation naming the top contributing factors before any figure is published.](/queries/sop-evidence-gate-variance-narrative-draft.md)
- [Execute action_siemens_opcenter_mes_publish to push the daily scrap cost dashboard to Looker's dashboards and metric_definitions, with a full audit trail, and escalate any single-day spike above threshold to the Plant Controller and production supervisor.](/queries/dashboard-publish-controller-escalation.md)

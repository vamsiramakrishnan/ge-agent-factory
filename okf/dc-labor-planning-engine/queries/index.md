---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query warehouse_orders and pick_tasks from Manhattan Active WM and correlate against inbound ASN volume to project function-level wave workload 72 hours out for the DC Labor Planning Engine workflow.](/queries/wave-volume-forecasting.md)
- [Cross-check UKG Dimensions timecards and shift_schedules against Manhattan Active WM engineered pick rates (pick_tasks cases_per_hour) so the labor standard is true before it feeds the forecast.](/queries/labor-standard-timecard-reconciliation.md)
- [Compare labor_forecasts (forecast_hours, earned_hours_standard, minimum_coverage_hours) against BigQuery historical_metrics and analytics_events to score department-level coverage gaps and rank the DC Operations Manager's queue.](/queries/capacity-gap-scoring.md)
- [Generate department-level shift_schedules in UKG Dimensions sized to the scored gap, drawing on labor_forecasts flex_hours and temp-labor options before the 72-hour cutoff.](/queries/shift-plan-flex-labor-assembly.md)
- [Cite the DC Labor Planning Engine Retail Execution Playbook and the Fair Workweek & Engineered Standards Runbook via lookup_dc_labor_planning_engine_execution_playbook, checking predictive-scheduling notice windows and clopening rules before any plan is published.](/queries/playbook-runbook-validation.md)
- [Execute action_manhattan_active_wm_generate to publish the shift plan in Manhattan Active WM with a generated_audit_trail entry, and notify the DC Operations Manager of remaining capacity gaps and flex-labor options.](/queries/publish-audit-notify.md)

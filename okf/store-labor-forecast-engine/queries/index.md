---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull Oracle Xstore POS pos_transactions and store_shift_summaries alongside BigQuery historical_metrics and analytics_events to reconstruct 15-minute interval demand curves per store_number before any forecast is touched.](/queries/demand-signal-capture.md)
- [Write forecast_hours, minimum_coverage_hours, and primary_driver into UKG Dimensions labor_forecasts for each forecast_week and department, reconciling against cached_aggregates to keep variance_to_budget_pct inside tolerance.](/queries/interval-level-labor-forecasting.md)
- [Draft UKG Dimensions shift_schedules against timecards-derived availability, role/skill mix, clopening_flag rest gaps, and overtime_hours exposure, blocking any draft that would breach fair-workweek posting-window rules.](/queries/draft-schedule-assembly-compliance-check.md)
- [Cite the Store Labor Forecast Engine Retail Execution Playbook and the fair-workweek compliance manual before calling action_ukg_dimensions_recommend, requiring corroborating evidence from at least two source systems.](/queries/playbook-gated-recommend-publish.md)
- [Notify the Store Workforce Planner of coverage gaps against minimum_coverage_hours, recommend shift swaps before schedule_posted_date, and route any escalation-rule trigger to the named handoff role with the audit trail attached.](/queries/manager-notification-exception-handoff.md)

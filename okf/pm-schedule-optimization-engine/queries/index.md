---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query IBM Maximo's maintenance_work_orders, asset_registry_entries, and failure_codes for every active PM task and its completion/finding history.](/queries/pm-failure-history-pull.md)
- [Correlate PM findings against OSIsoft PI System sensor_readings, asset_tag_hierarchies, and downtime_events to confirm whether a zero-finding record reflects a genuinely healthy asset or an under-monitored one.](/queries/runtime-correlation.md)
- [Score each PM task's extend, tighten, or condition-based candidacy in BigQuery using analytics_events and historical_metrics baselines, weighted by asset_registry_entries.criticality_ranking and mean_time_between_failures_hours.](/queries/interval-scoring.md)
- [Check every proposed interval change against the PM Schedule Optimization Engine Standard Operating Procedure and the PM Interval Revision & OEM Warranty Compliance Policy, citing the specific control-limit and warranty-bound sections before drafting anything.](/queries/policy-sop-citation-gate.md)
- [Draft the revised PM route package via action_ibm_maximo_route, route it to the Maintenance Planner for sign-off, and track post-change failure_codes occurrence rates in BigQuery to validate the interval change actually worked.](/queries/route-package-draft-planner-approval.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull open field_work_orders and technician_schedules from Oracle Field Service and correlate against Splunk log_events and alert_actions to see which tower sites currently have unresolved alarms or in-flight dispatches.](/queries/site-alarm-intake.md)
- [Score equipment age, alarm trends, and storm-season timing for each site against historical_metrics and cached_aggregates baselines in BigQuery to rank preventive maintenance priority across the tower portfolio.](/queries/risk-ranked-schedule-build.md)
- [Bundle compatible work_type items into a single site visit and match them against technician_schedules, filtering to tower_climb_certified crews at the right garage_location before a bundle is proposed.](/queries/crew-visit-bundling.md)
- [Flag degrading battery/generator trends surfaced in analytics_events and alert_actions and convert them into priority field_work_orders ahead of storm season rather than waiting for the next standard PM cycle.](/queries/power-degradation-triage.md)
- [Validate every proposed schedule change or priority work order against the Tower Maintenance Scheduling Engine Service Assurance Runbook, then execute action_oracle_field_service_notify in Oracle Field Service with a full audit trail, escalating exceptions to the Infrastructure Maintenance Planner.](/queries/runbook-gate-dispatch.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Match incoming Zendesk tickets against open field_work_orders and service_appointments in Oracle Field Service to confirm whether a dispatch is already queued for the premise before any new diagnostic work starts.](/queries/ticket-to-work-order-correlation.md)
- [Run the line, CPE, and provisioning check sequence (ONT reset, profile re-push, firmware verification) against the work order's premise and log results alongside BigQuery analytics_events readings for that circuit.](/queries/remote-diagnostic-battery.md)
- [Score the open field_work_orders record's no-fault-found risk using its repeat_within_30d flag and truck_rolls count against BigQuery historical_metrics and cached_aggregates baselines to decide whether remote resolution is viable.](/queries/no-fault-found-risk-scoring.md)
- [Cross-check the diagnostic and risk-scoring outputs against the Truck Roll Avoidance Agent Service Assurance Runbook's remediation and escalation sections, citing the governing anchor before recommending a remote fix or a dispatch.](/queries/runbook-gated-remediation-decision.md)
- [Execute action_oracle_field_service_file for unavoidable dispatches, matching the technician_schedules assignment to the required primary_skill and garage_location, attaching diagnostic evidence and recommended materials_cost_usd parts, with a full audit trail.](/queries/dispatch-filing-technician-brief.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query field_work_orders in Oracle Field Service for excavation- and install_fiber-flagged jobs by premise_id and dispatch_date, then pull open tickets and change_requests from ServiceNow for the same premise to surface conflicting dig or access requests before an application is drafted.](/queries/permit-gated-work-order-triage.md)
- [Confirm technician_schedules primary_skill and tower_climb_certified status against the job's traffic-control and elevated-work requirements, and validate that an 811 one-call locate ticket is in a valid window relative to service_appointments arrival_window and dispatch_date.](/queries/crew-locate-readiness-check.md)
- [Run query_bigquery_analytics_events against historical_metrics and cached_aggregates to age each pending application against the jurisdiction's permit-turnaround baseline, scoring which submissions are approaching or past the SLA threshold.](/queries/jurisdiction-sla-aging-baseline-comparison.md)
- [Invoke lookup_fiber_build_permitting_agent_assurance_runbook and cite the governing sections of the Municipal Right-of-Way Permitting & 811 Locate Compliance Playbook before drafting, resubmitting, or escalating any application.](/queries/rules-library-playbook-evidence-validation.md)
- [Execute action_oracle_field_service_escalate for stalled or rejected permits tied to field_work_orders, attach the full audit trail, and hand off to the Construction Program Manager or named specialist per the escalation matrix.](/queries/escalate-stalled-permits-audit.md)

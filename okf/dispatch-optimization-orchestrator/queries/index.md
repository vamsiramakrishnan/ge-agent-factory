---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the day's field_work_orders and technician_schedules from Oracle Field Service to rebuild the route board at shift start and again after every cancellation or overrun.](/queries/route-board-intake.md)
- [Cross-check technician_schedules primary_skill and tower_climb_certified against each field_work_orders work_type, gating any tower-crew or fiber-splicing assignment on the Field Technician Certification & Safety Work Instruction.](/queries/skill-certification-match.md)
- [Score service_appointments arrival_window jeopardy and field_work_orders repeat_within_30d exposure against analytics_events and historical_metrics baselines in BigQuery to prioritize the Field Operations Supervisor's exception queue.](/queries/sla-baseline-risk-scoring.md)
- [Evaluate where an emergency ticket can be inserted into the route with the least appointment_window breakage, checking cached_aggregates and dashboards in Looker before committing the reshuffle.](/queries/emergency-insertion-re-optimization.md)
- [Cite the governing sections of the Dispatch Optimization Orchestrator Service Assurance Runbook before calling action_oracle_field_service_route, and refuse or escalate when two-system evidence is missing.](/queries/evidence-gated-dispatch.md)
- [Push live technician ETAs to customers, auto-rebook any service_appointments record that falls outside its window, and log the audit trail for the Field Operations Supervisor.](/queries/eta-notification-audit-close-out.md)

---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the newest safety_incidents record from Sphera EHS (query_sphera_ehs_safety_incidents) and cross-reference permit_records to see whether a loto, hot_work, confined_space_entry, or energized_electrical permit was active at the time of the event.](/queries/new-report-intake-permit-cross-reference.md)
- [Score osha_classification, injury_type, and days_away to separate near_miss and first_aid noise from recordable, restricted_duty_dart, lost_time_dart, and fatality cases that need immediate handling.](/queries/severity-osha-recordability-scoring.md)
- [Query analytics_events in BigQuery (query_bigquery_analytics_events) to surface similar prior incidents and confirm whether this event pushes the Recordable incident rate (TRIR) off its 2.4-to-1.1 improvement path.](/queries/historical-precedent-trir-baseline-correlation.md)
- [Call lookup_incident_near_miss_triage_agent_sop to cite the governing SOP sections and cross-check the 29 CFR 1904 Recordkeeping and Reporting Compliance Bulletin before any classification or escalation is finalized.](/queries/sop-recordkeeping-bulletin-evidence-gate.md)
- [Open or update corrective-action tickets in ServiceNow (query_servicenow_tickets), assign an owner, and flag any ticket whose sla_met is false and created_at is aging past policy.](/queries/corrective-action-assignment-service-now-ticketing.md)
- [Execute action_sphera_ehs_escalate against Sphera EHS for serious-injury-potential and reportability-triggering cases, attach the generated_audit_trail, and notify the Site Safety Officer of the outcome.](/queries/escalation-audit-closeout.md)

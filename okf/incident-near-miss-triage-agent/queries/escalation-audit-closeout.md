---
type: Query Capability
title: "Execute action_sphera_ehs_escalate against Sphera EHS for serious-injury-pote..."
description: "Execute action_sphera_ehs_escalate against Sphera EHS for serious-injury-potential and reportability-triggering cases, attach the generated_audit_trail, and notify the Site Safety Officer of the outcome."
source_id: "escalation-audit-closeout"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_sphera_ehs_escalate against Sphera EHS for serious-injury-potential and reportability-triggering cases, attach the generated_audit_trail, and notify the Site Safety Officer of the outcome.

## Tools used

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [action_sphera_ehs_escalate](/tools/action-sphera-ehs-escalate.md)

## Runs in

- [escalation_audit_closeout](/workflow/escalation-audit-closeout.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/incident-near-miss-triage-agent-end-to-end.md)
- [Incident #43217 in Sphera EHS was logged with osha_classification=near_miss, but injury_type says fracture with 14 days_away. It happened during confined-space permit #151932, which shows attendant_assigned=false in permit_records. Reconcile the record and tell me whether this needs to be recoded as OSHA recordable before Friday's log update.](/tests/incident-near-miss-triage-agent-severity-reclass-check.md)
- [ServiceNow ticket #8842 was opened 34 days ago as the corrective action for safety_incidents record #43050 (osha_classification: lost_time_dart), assignee Maria Chen, sla_met is still false and root_cause_complete on the incident is also false. BigQuery analytics_events shows on-time closure trending down this month. Close ticket #8842 out and mark the TRIR case resolved.](/tests/incident-near-miss-triage-agent-stale-corrective-action.md)

# Citations

- [Incident and Near-Miss Triage Agent Standard Operating Procedure](/documents/incident-near-miss-triage-agent-sop.md)
- [29 CFR 1904 Recordkeeping and Reporting Compliance Bulletin](/documents/osha-1904-recordkeeping-reporting-bulletin.md)

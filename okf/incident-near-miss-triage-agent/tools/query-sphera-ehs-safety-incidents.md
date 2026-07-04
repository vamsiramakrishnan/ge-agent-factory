---
type: Agent Tool
title: query_sphera_ehs_safety_incidents
description: "Retrieve safety incidents from Sphera EHS for the Incident and Near-Miss Triage Agent workflow."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sphera_ehs_safety_incidents

Retrieve safety incidents from Sphera EHS for the Incident and Near-Miss Triage Agent workflow.

- **Kind:** query
- **Source system:** [Sphera EHS](/systems/sphera-ehs.md)

## Inputs

- incident_number
- date_range

## Outputs

- safety_incidents_records
- safety_incidents_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sphera EHS](/systems/sphera-ehs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [new_report_intake_permit_cross_reference](/workflow/new-report-intake-permit-cross-reference.md)
- [historical_precedent_trir_baseline_correlation](/workflow/historical-precedent-trir-baseline-correlation.md)
- [escalation_audit_closeout](/workflow/escalation-audit-closeout.md)

## Evals

- [Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/incident-near-miss-triage-agent-end-to-end.md)
- [Incident #43217 in Sphera EHS was logged with osha_classification=near_miss, but injury_type says fracture with 14 days_away. It happened during confined-space permit #151932, which shows attendant_assigned=false in permit_records. Reconcile the record and tell me whether this needs to be recoded as OSHA recordable before Friday's log update.](/tests/incident-near-miss-triage-agent-severity-reclass-check.md)
- [ServiceNow ticket #8842 was opened 34 days ago as the corrective action for safety_incidents record #43050 (osha_classification: lost_time_dart), assignee Maria Chen, sla_met is still false and root_cause_complete on the incident is also false. BigQuery analytics_events shows on-time closure trending down this month. Close ticket #8842 out and mark the TRIR case resolved.](/tests/incident-near-miss-triage-agent-stale-corrective-action.md)

## Evidence emitted

- source_system_record

## Required inputs

- incident_number
- date_range

## Produces

- safety_incidents_records
- safety_incidents_summary

# Examples

```
query_sphera_ehs_safety_incidents(incident_number=<incident_number>, date_range=<date_range>)
```

# Citations

- [Sphera EHS](/systems/sphera-ehs.md)

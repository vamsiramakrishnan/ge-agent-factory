---
type: Proof Obligation
title: "Golden eval obligation — Run the Requisition Prioritization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-requisition-prioritization-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Requisition Prioritization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [requisition-prioritization-agent-end-to-end](/tests/requisition-prioritization-agent-end-to-end.md)


## Mechanisms

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_requisition_prioritization_agent_policy_handbook](/tools/lookup-requisition-prioritization-agent-policy-handbook.md)
- [action_ats_file](/tools/action-ats-file.md)

## Entities that must be referenced

- ats_records
- employees
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [requisition-prioritization-agent-policy-handbook](/documents/requisition-prioritization-agent-policy-handbook.md)

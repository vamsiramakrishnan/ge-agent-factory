---
type: Proof Obligation
title: "Golden eval obligation — Run the ER Case Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-er-case-intelligence-end-to-end"
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

# Golden eval obligation — Run the ER Case Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [er-case-intelligence-end-to-end](/tests/er-case-intelligence-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_er_case_intelligence_policy_handbook](/tools/lookup-er-case-intelligence-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Entities that must be referenced

- tickets
- employees
- analytics_events
- legal_db_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [er-case-intelligence-policy-handbook](/documents/er-case-intelligence-policy-handbook.md)

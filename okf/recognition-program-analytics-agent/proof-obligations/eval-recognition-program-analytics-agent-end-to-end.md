---
type: Proof Obligation
title: "Golden eval obligation — Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-recognition-program-analytics-agent-end-to-end"
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

# Golden eval obligation — Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [recognition-program-analytics-agent-end-to-end](/tests/recognition-program-analytics-agent-end-to-end.md)


## Mechanisms

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_recognition_program_analytics_agent_policy_handbook](/tools/lookup-recognition-program-analytics-agent-policy-handbook.md)
- [action_recognition_platform_execute](/tools/action-recognition-platform-execute.md)

## Entities that must be referenced

- recognition_platform_records
- employees
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [recognition-program-analytics-agent-policy-handbook](/documents/recognition-program-analytics-agent-policy-handbook.md)

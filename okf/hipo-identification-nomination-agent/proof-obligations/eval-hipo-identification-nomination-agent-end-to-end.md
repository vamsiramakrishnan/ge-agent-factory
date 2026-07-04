---
type: Proof Obligation
title: "Golden eval obligation — Run the HiPo Identification & Nomination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-hipo-identification-nomination-agent-end-to-end"
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

# Golden eval obligation — Run the HiPo Identification & Nomination Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [hipo-identification-nomination-agent-end-to-end](/tests/hipo-identification-nomination-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_360_platform_360_platform_records](/tools/query-360-platform-360-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_hipo_identification_nomination_agent_policy_handbook](/tools/lookup-hipo-identification-nomination-agent-policy-handbook.md)

## Entities that must be referenced

- employees
- 360_platform_records
- analytics_events
- lms_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [hipo-identification-nomination-agent-policy-handbook](/documents/hipo-identification-nomination-agent-policy-handbook.md)

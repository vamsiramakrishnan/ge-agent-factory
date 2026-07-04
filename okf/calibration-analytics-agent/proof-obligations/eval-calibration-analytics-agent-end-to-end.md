---
type: Proof Obligation
title: "Golden eval obligation — Run the Calibration Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-calibration-analytics-agent-end-to-end"
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

# Golden eval obligation — Run the Calibration Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [calibration-analytics-agent-end-to-end](/tests/calibration-analytics-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_calibration_analytics_agent_policy_handbook](/tools/lookup-calibration-analytics-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Entities that must be referenced

- employees
- analytics_events
- sheets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [calibration-analytics-agent-policy-handbook](/documents/calibration-analytics-agent-policy-handbook.md)

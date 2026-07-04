---
type: Proof Obligation
title: "Golden eval obligation — Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-recognition-nudge-celebration-end-to-end"
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

# Golden eval obligation — Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [recognition-nudge-celebration-end-to-end](/tests/recognition-nudge-celebration-end-to-end.md)


## Mechanisms

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [lookup_recognition_nudge_celebration_policy_handbook](/tools/lookup-recognition-nudge-celebration-policy-handbook.md)
- [action_slack_generate](/tools/action-slack-generate.md)

## Entities that must be referenced

- messages
- employees
- recognition_platform_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [recognition-nudge-celebration-policy-handbook](/documents/recognition-nudge-celebration-policy-handbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the 1:1 Meeting Prep workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-1-1-meeting-prep-end-to-end"
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

# Golden eval obligation — Run the 1:1 Meeting Prep workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [1-1-meeting-prep-end-to-end](/tests/1-1-meeting-prep-end-to-end.md)


## Mechanisms

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_1_1_meeting_prep_policy_handbook](/tools/lookup-1-1-meeting-prep-policy-handbook.md)
- [action_google_calendar_generate](/tools/action-google-calendar-generate.md)

## Entities that must be referenced

- events
- employees
- messages
- engagement_surveys

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [1-1-meeting-prep-policy-handbook](/documents/1-1-meeting-prep-policy-handbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the OKR Progress Tracker Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-okr-progress-tracker-agent-end-to-end"
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

# Golden eval obligation — Run the OKR Progress Tracker Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [okr-progress-tracker-agent-end-to-end](/tests/okr-progress-tracker-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_okr_progress_tracker_agent_policy_handbook](/tools/lookup-okr-progress-tracker-agent-policy-handbook.md)

## Entities that must be referenced

- employees
- issues
- sheets
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [okr-progress-tracker-agent-policy-handbook](/documents/okr-progress-tracker-agent-policy-handbook.md)

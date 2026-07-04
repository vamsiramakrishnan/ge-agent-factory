---
type: Proof Obligation
title: "Golden eval obligation — Run the Review Cycle Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-review-cycle-orchestration-agent-end-to-end"
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

# Golden eval obligation — Run the Review Cycle Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [review-cycle-orchestration-agent-end-to-end](/tests/review-cycle-orchestration-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_review_cycle_orchestration_agent_policy_handbook](/tools/lookup-review-cycle-orchestration-agent-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Entities that must be referenced

- employees
- messages
- messages
- sheets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [review-cycle-orchestration-agent-policy-handbook](/documents/review-cycle-orchestration-agent-policy-handbook.md)

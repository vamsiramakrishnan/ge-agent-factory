---
type: Proof Obligation
title: "Golden eval obligation — Run the Onboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-onboarding-orchestration-end-to-end"
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

# Golden eval obligation — Run the Onboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [onboarding-orchestration-end-to-end](/tests/onboarding-orchestration-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_onboarding_orchestration_policy_handbook](/tools/lookup-onboarding-orchestration-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Entities that must be referenced

- employees
- lms_records
- tickets
- messages
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute assign without two-system evidence

# Citations

- [onboarding-orchestration-policy-handbook](/documents/onboarding-orchestration-policy-handbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the Onboarding Tech Setup Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-onboarding-tech-setup-orchestrator-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Onboarding Tech Setup Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [onboarding-tech-setup-orchestrator-end-to-end](/tests/onboarding-tech-setup-orchestrator-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [lookup_onboarding_tech_setup_orchestrator_runbook](/tools/lookup-onboarding-tech-setup-orchestrator-runbook.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

## Entities that must be referenced

- employees
- users
- accounts
- manageengine_records
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute trigger without two-system evidence

# Citations

- [onboarding-tech-setup-orchestrator-runbook](/documents/onboarding-tech-setup-orchestrator-runbook.md)

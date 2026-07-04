---
type: Proof Obligation
title: "Golden eval obligation — Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-offboarding-orchestration-end-to-end"
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

# Golden eval obligation — Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [offboarding-orchestration-end-to-end](/tests/offboarding-orchestration-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_active_directory_directory_users](/tools/query-active-directory-directory-users.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_offboarding_orchestration_policy_handbook](/tools/lookup-offboarding-orchestration-policy-handbook.md)
- [action_workday_provision](/tools/action-workday-provision.md)

## Entities that must be referenced

- employees
- directory_users
- tickets
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute provision without two-system evidence

# Citations

- [offboarding-orchestration-policy-handbook](/documents/offboarding-orchestration-policy-handbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the Job Architecture Sync Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-job-architecture-sync-agent-end-to-end"
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

# Golden eval obligation — Run the Job Architecture Sync Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [job-architecture-sync-agent-end-to-end](/tests/job-architecture-sync-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_job_architecture_sync_agent_policy_handbook](/tools/lookup-job-architecture-sync-agent-policy-handbook.md)
- [action_workday_publish](/tools/action-workday-publish.md)

## Entities that must be referenced

- employees
- employee_records
- mercer_records
- sheets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [job-architecture-sync-agent-policy-handbook](/documents/job-architecture-sync-agent-policy-handbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-employee-query-resolution-end-to-end"
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

# Golden eval obligation — Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [employee-query-resolution-end-to-end](/tests/employee-query-resolution-end-to-end.md)


## Mechanisms

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_knowledge_base_knowledge_base_records](/tools/query-knowledge-base-knowledge-base-records.md)
- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)
- [action_google_chat_execute](/tools/action-google-chat-execute.md)

## Entities that must be referenced

- messages
- tickets
- employees
- knowledge_base_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [employee-query-resolution-policy-handbook](/documents/employee-query-resolution-policy-handbook.md)

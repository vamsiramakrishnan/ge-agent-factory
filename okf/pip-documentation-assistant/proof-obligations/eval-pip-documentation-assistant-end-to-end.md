---
type: Proof Obligation
title: "Golden eval obligation — Run the PIP Documentation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-pip-documentation-assistant-end-to-end"
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

# Golden eval obligation — Run the PIP Documentation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [pip-documentation-assistant-end-to-end](/tests/pip-documentation-assistant-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_pip_documentation_assistant_policy_handbook](/tools/lookup-pip-documentation-assistant-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Entities that must be referenced

- employees
- documents
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [pip-documentation-assistant-policy-handbook](/documents/pip-documentation-assistant-policy-handbook.md)

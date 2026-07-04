---
type: Proof Obligation
title: "Golden eval obligation — Run the Employee Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-employee-communication-drafter-end-to-end"
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

# Golden eval obligation — Run the Employee Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [employee-communication-drafter-end-to-end](/tests/employee-communication-drafter-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_intranet_intranet_records](/tools/query-intranet-intranet-records.md)
- [lookup_employee_communication_drafter_policy_handbook](/tools/lookup-employee-communication-drafter-policy-handbook.md)
- [action_google_docs_draft](/tools/action-google-docs-draft.md)

## Entities that must be referenced

- documents
- messages
- messages
- intranet_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [employee-communication-drafter-policy-handbook](/documents/employee-communication-drafter-policy-handbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the Change Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-change-communication-drafter-end-to-end"
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

# Golden eval obligation — Run the Change Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [change-communication-drafter-end-to-end](/tests/change-communication-drafter-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_change_communication_drafter_policy_handbook](/tools/lookup-change-communication-drafter-policy-handbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Entities that must be referenced

- documents
- messages
- messages
- employees

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [change-communication-drafter-policy-handbook](/documents/change-communication-drafter-policy-handbook.md)

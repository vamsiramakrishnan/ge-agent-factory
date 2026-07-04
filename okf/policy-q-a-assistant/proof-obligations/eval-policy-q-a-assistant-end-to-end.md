---
type: Proof Obligation
title: "Golden eval obligation — Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-policy-q-a-assistant-end-to-end"
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

# Golden eval obligation — Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [policy-q-a-assistant-end-to-end](/tests/policy-q-a-assistant-end-to-end.md)


## Mechanisms

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_sharepoint_documents](/tools/query-sharepoint-documents.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_policy_q_a_assistant_policy_handbook](/tools/lookup-policy-q-a-assistant-policy-handbook.md)

## Entities that must be referenced

- messages
- pages
- documents
- employees

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [policy-q-a-assistant-policy-handbook](/documents/policy-q-a-assistant-policy-handbook.md)

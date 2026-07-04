---
type: Proof Obligation
title: "Golden eval obligation — Run the New Hire Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-new-hire-q-a-assistant-end-to-end"
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

# Golden eval obligation — Run the New Hire Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [new-hire-q-a-assistant-end-to-end](/tests/new-hire-q-a-assistant-end-to-end.md)


## Mechanisms

- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [query_confluence_pages](/tools/query-confluence-pages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_new_hire_q_a_assistant_policy_handbook](/tools/lookup-new-hire-q-a-assistant-policy-handbook.md)

## Entities that must be referenced

- messages
- pages
- employees
- lms_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [new-hire-q-a-assistant-policy-handbook](/documents/new-hire-q-a-assistant-policy-handbook.md)

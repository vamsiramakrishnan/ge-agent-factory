---
type: Proof Obligation
title: "Golden eval obligation — Run the DEI Communication & Programming Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-dei-communication-programming-assistant-end-to-end"
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

# Golden eval obligation — Run the DEI Communication & Programming Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [dei-communication-programming-assistant-end-to-end](/tests/dei-communication-programming-assistant-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_intranet_intranet_records](/tools/query-intranet-intranet-records.md)
- [lookup_dei_communication_programming_assistant_policy_handbook](/tools/lookup-dei-communication-programming-assistant-policy-handbook.md)

## Entities that must be referenced

- documents
- messages
- lms_records
- intranet_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [dei-communication-programming-assistant-policy-handbook](/documents/dei-communication-programming-assistant-policy-handbook.md)

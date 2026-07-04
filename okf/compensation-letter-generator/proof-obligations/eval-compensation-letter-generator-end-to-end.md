---
type: Proof Obligation
title: "Golden eval obligation — Run the Compensation Letter Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-compensation-letter-generator-end-to-end"
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

# Golden eval obligation — Run the Compensation Letter Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [compensation-letter-generator-end-to-end](/tests/compensation-letter-generator-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [lookup_compensation_letter_generator_policy_handbook](/tools/lookup-compensation-letter-generator-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Entities that must be referenced

- employees
- documents
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [compensation-letter-generator-policy-handbook](/documents/compensation-letter-generator-policy-handbook.md)

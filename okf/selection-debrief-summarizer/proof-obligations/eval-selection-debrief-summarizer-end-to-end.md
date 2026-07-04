---
type: Proof Obligation
title: "Golden eval obligation — Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-selection-debrief-summarizer-end-to-end"
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

# Golden eval obligation — Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [selection-debrief-summarizer-end-to-end](/tests/selection-debrief-summarizer-end-to-end.md)


## Mechanisms

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_meet_google_meet_records](/tools/query-google-meet-google-meet-records.md)
- [lookup_selection_debrief_summarizer_policy_handbook](/tools/lookup-selection-debrief-summarizer-policy-handbook.md)
- [action_ats_generate](/tools/action-ats-generate.md)

## Entities that must be referenced

- ats_records
- documents
- google_meet_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [selection-debrief-summarizer-policy-handbook](/documents/selection-debrief-summarizer-policy-handbook.md)

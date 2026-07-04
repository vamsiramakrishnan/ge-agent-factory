---
type: Proof Obligation
title: "Golden eval obligation — Run the L&D Plan Narrative Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-l-d-plan-narrative-drafter-end-to-end"
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

# Golden eval obligation — Run the L&D Plan Narrative Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [l-d-plan-narrative-drafter-end-to-end](/tests/l-d-plan-narrative-drafter-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_l_d_plan_narrative_drafter_policy_handbook](/tools/lookup-l-d-plan-narrative-drafter-policy-handbook.md)
- [action_google_docs_recommend](/tools/action-google-docs-recommend.md)

## Entities that must be referenced

- documents
- presentations
- lms_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [l-d-plan-narrative-drafter-policy-handbook](/documents/l-d-plan-narrative-drafter-policy-handbook.md)

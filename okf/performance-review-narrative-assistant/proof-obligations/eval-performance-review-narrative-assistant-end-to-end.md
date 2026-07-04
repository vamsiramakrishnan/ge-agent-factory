---
type: Proof Obligation
title: "Golden eval obligation — Run the Performance Review Narrative Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-performance-review-narrative-assistant-end-to-end"
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

# Golden eval obligation — Run the Performance Review Narrative Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [performance-review-narrative-assistant-end-to-end](/tests/performance-review-narrative-assistant-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [lookup_performance_review_narrative_assistant_policy_handbook](/tools/lookup-performance-review-narrative-assistant-policy-handbook.md)

## Entities that must be referenced

- employees
- documents
- engagement_surveys

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [performance-review-narrative-assistant-policy-handbook](/documents/performance-review-narrative-assistant-policy-handbook.md)

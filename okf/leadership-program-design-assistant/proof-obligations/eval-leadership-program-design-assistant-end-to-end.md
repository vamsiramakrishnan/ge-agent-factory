---
type: Proof Obligation
title: "Golden eval obligation — Run the Leadership Program Design Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-leadership-program-design-assistant-end-to-end"
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

# Golden eval obligation — Run the Leadership Program Design Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [leadership-program-design-assistant-end-to-end](/tests/leadership-program-design-assistant-end-to-end.md)


## Mechanisms

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_assessment_platform_assessment_platform_records](/tools/query-assessment-platform-assessment-platform-records.md)
- [lookup_leadership_program_design_assistant_policy_handbook](/tools/lookup-leadership-program-design-assistant-policy-handbook.md)
- [action_lms_assign](/tools/action-lms-assign.md)

## Entities that must be referenced

- lms_records
- documents
- assessment_platform_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute assign without two-system evidence

# Citations

- [leadership-program-design-assistant-policy-handbook](/documents/leadership-program-design-assistant-policy-handbook.md)

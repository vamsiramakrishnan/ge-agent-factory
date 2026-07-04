---
type: Proof Obligation
title: "Golden eval obligation — Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-compliance-training-content-generator-end-to-end"
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

# Golden eval obligation — Run the Compliance Training Content Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [compliance-training-content-generator-end-to-end](/tests/compliance-training-content-generator-end-to-end.md)


## Mechanisms

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_compliance_training_content_generator_policy_handbook](/tools/lookup-compliance-training-content-generator-policy-handbook.md)
- [action_lms_generate](/tools/action-lms-generate.md)

## Entities that must be referenced

- lms_records
- legal_db_records
- documents

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [compliance-training-content-generator-policy-handbook](/documents/compliance-training-content-generator-policy-handbook.md)

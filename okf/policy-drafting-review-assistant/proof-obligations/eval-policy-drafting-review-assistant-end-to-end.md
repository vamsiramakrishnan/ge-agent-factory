---
type: Proof Obligation
title: "Golden eval obligation — Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-policy-drafting-review-assistant-end-to-end"
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

# Golden eval obligation — Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [policy-drafting-review-assistant-end-to-end](/tests/policy-drafting-review-assistant-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [query_sharepoint_documents](/tools/query-sharepoint-documents.md)
- [lookup_policy_drafting_review_assistant_policy_handbook](/tools/lookup-policy-drafting-review-assistant-policy-handbook.md)
- [action_google_docs_publish](/tools/action-google-docs-publish.md)

## Entities that must be referenced

- documents
- legal_db_records
- documents

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [policy-drafting-review-assistant-policy-handbook](/documents/policy-drafting-review-assistant-policy-handbook.md)

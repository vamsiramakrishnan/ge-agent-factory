---
type: Proof Obligation
title: "Golden eval obligation — Run the Long-Form Content Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-long-form-content-drafter-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Long-Form Content Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [long-form-content-drafter-end-to-end](/tests/long-form-content-drafter-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_contentful_content_entries](/tools/query-contentful-content-entries.md)
- [lookup_long_form_content_drafter_playbook](/tools/lookup-long-form-content-drafter-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Entities that must be referenced

- documents
- content_entries
- content_entries

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [long-form-content-drafter-playbook](/documents/long-form-content-drafter-playbook.md)

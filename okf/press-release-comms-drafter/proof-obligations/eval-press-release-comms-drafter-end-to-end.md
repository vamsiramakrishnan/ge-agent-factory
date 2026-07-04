---
type: Proof Obligation
title: "Golden eval obligation — Run the Press Release & Comms Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-press-release-comms-drafter-end-to-end"
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

# Golden eval obligation — Run the Press Release & Comms Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [press-release-comms-drafter-end-to-end](/tests/press-release-comms-drafter-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_pr_newswire_pr_newswire_records](/tools/query-pr-newswire-pr-newswire-records.md)
- [query_cision_cision_records](/tools/query-cision-cision-records.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_press_release_comms_drafter_playbook](/tools/lookup-press-release-comms-drafter-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Entities that must be referenced

- documents
- pr_newswire_records
- cision_records
- content_entries

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [press-release-comms-drafter-playbook](/documents/press-release-comms-drafter-playbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-dam-content-lifecycle-manager-end-to-end"
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

# Golden eval obligation — Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [dam-content-lifecycle-manager-end-to-end](/tests/dam-content-lifecycle-manager-end-to-end.md)


## Mechanisms

- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_brandfolder_brandfolder_records](/tools/query-brandfolder-brandfolder-records.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_dam_content_lifecycle_manager_playbook](/tools/lookup-dam-content-lifecycle-manager-playbook.md)
- [action_bynder_recommend](/tools/action-bynder-recommend.md)

## Entities that must be referenced

- assets
- brandfolder_records
- documents
- content_entries
- content_entries

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [dam-content-lifecycle-manager-playbook](/documents/dam-content-lifecycle-manager-playbook.md)

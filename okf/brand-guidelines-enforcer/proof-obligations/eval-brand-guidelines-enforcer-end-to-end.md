---
type: Proof Obligation
title: "Golden eval obligation — Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-brand-guidelines-enforcer-end-to-end"
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

# Golden eval obligation — Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [brand-guidelines-enforcer-end-to-end](/tests/brand-guidelines-enforcer-end-to-end.md)


## Mechanisms

- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_figma_assets](/tools/query-figma-assets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [lookup_brand_guidelines_enforcer_playbook](/tools/lookup-brand-guidelines-enforcer-playbook.md)
- [action_bynder_generate](/tools/action-bynder-generate.md)

## Entities that must be referenced

- assets
- assets
- documents
- assets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [brand-guidelines-enforcer-playbook](/documents/brand-guidelines-enforcer-playbook.md)

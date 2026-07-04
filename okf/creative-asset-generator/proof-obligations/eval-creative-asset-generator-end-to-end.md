---
type: Proof Obligation
title: "Golden eval obligation — Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-creative-asset-generator-end-to-end"
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

# Golden eval obligation — Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [creative-asset-generator-end-to-end](/tests/creative-asset-generator-end-to-end.md)


## Mechanisms

- [query_figma_assets](/tools/query-figma-assets.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [lookup_creative_asset_generator_playbook](/tools/lookup-creative-asset-generator-playbook.md)
- [action_figma_generate](/tools/action-figma-generate.md)

## Entities that must be referenced

- assets
- assets
- assets
- documents

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [creative-asset-generator-playbook](/documents/creative-asset-generator-playbook.md)

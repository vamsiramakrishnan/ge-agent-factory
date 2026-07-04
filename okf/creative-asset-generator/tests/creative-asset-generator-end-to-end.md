---
type: Eval Scenario
title: Run the Creative Asset Generator workflow for the current period. Cite the re...
description: "Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "creative-asset-generator-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [approval-publishing](/queries/approval-publishing.md)

## Mechanisms to call

- [query_figma_assets](/tools/query-figma-assets.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [lookup_creative_asset_generator_playbook](/tools/lookup-creative-asset-generator-playbook.md)
- [action_figma_generate](/tools/action-figma-generate.md)

## Success rubric

Action generate executed against Figma, with audit-trail entry and Brand Manager notified of outcomes.

# Citations

- [Creative Asset Generator Playbook](/documents/creative-asset-generator-playbook.md)

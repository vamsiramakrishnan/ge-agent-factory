---
type: Eval Scenario
title: Run the Brand Guidelines Enforcer workflow for the current period. Cite the r...
description: "Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "brand-guidelines-enforcer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [asset-ingestion](/queries/asset-ingestion.md)

## Mechanisms to call

- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_figma_assets](/tools/query-figma-assets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [lookup_brand_guidelines_enforcer_playbook](/tools/lookup-brand-guidelines-enforcer-playbook.md)
- [action_bynder_generate](/tools/action-bynder-generate.md)

## Success rubric

Action generate executed against Bynder, with audit-trail entry and Brand Manager notified of outcomes.

# Citations

- [Brand Guidelines Enforcer Playbook](/documents/brand-guidelines-enforcer-playbook.md)

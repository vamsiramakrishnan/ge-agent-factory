---
type: Query Capability
title: "Hook into design and content submission workflows across Bynder, Figma, and G..."
description: "Hook into design and content submission workflows across Bynder, Figma, and Google Drive. Extract visual elements and text content for analysis."
source_id: "asset-ingestion"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Hook into design and content submission workflows across Bynder, Figma, and Google Drive. Extract visual elements and text content for analysis.

## Tools used

- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_figma_assets](/tools/query-figma-assets.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [lookup_brand_guidelines_enforcer_playbook](/tools/lookup-brand-guidelines-enforcer-playbook.md)
- [action_bynder_generate](/tools/action-bynder-generate.md)

## Runs in

- [asset_ingestion](/workflow/asset-ingestion.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-guidelines-enforcer-end-to-end.md)

# Citations

- [Brand Guidelines Enforcer Playbook](/documents/brand-guidelines-enforcer-playbook.md)

---
type: Query Capability
title: Generated assets routed for Brand Manager approval. Approved assets published...
description: Generated assets routed for Brand Manager approval. Approved assets published to DAM with proper tagging and metadata.
source_id: "approval-publishing"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generated assets routed for Brand Manager approval. Approved assets published to DAM with proper tagging and metadata.

## Tools used

- [query_figma_assets](/tools/query-figma-assets.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [query_bynder_assets](/tools/query-bynder-assets.md)
- [lookup_creative_asset_generator_playbook](/tools/lookup-creative-asset-generator-playbook.md)
- [action_figma_generate](/tools/action-figma-generate.md)

## Runs in

- [approval_publishing](/workflow/approval-publishing.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/creative-asset-generator-end-to-end.md)

# Citations

- [Creative Asset Generator Playbook](/documents/creative-asset-generator-playbook.md)

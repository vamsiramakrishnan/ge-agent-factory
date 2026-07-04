---
type: Query Capability
title: Generate compliance report with specific correction guidance. Route violation...
description: Generate compliance report with specific correction guidance. Route violations to Brand Manager for review. Provide suggested rewrites for text and reference assets for visual fixes.
source_id: "report-remediation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate compliance report with specific correction guidance. Route violations to Brand Manager for review. Provide suggested rewrites for text and reference assets for visual fixes.

## Tools used

- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_figma_assets](/tools/query-figma-assets.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [lookup_brand_guidelines_enforcer_playbook](/tools/lookup-brand-guidelines-enforcer-playbook.md)
- [action_bynder_generate](/tools/action-bynder-generate.md)

## Runs in

- [report_remediation](/workflow/report-remediation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Brand Guidelines Enforcer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-guidelines-enforcer-end-to-end.md)

# Citations

- [Brand Guidelines Enforcer Playbook](/documents/brand-guidelines-enforcer-playbook.md)

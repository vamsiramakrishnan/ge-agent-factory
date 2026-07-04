---
type: Query Capability
title: "Package the reference architecture with component diagrams, cost projections,..."
description: "Package the reference architecture with component diagrams, cost projections, infrastructure templates, and operational runbooks. Publish to Confluence for reuse."
source_id: publication
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Package the reference architecture with component diagrams, cost projections, infrastructure templates, and operational runbooks. Publish to Confluence for reuse.

## Tools used

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [lookup_reference_architecture_generator_runbook](/tools/lookup-reference-architecture-generator-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

## Runs in

- [publication](/workflow/publication.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Reference Architecture Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/reference-architecture-generator-end-to-end.md)

# Citations

- [Reference Architecture Generator Operations Runbook](/documents/reference-architecture-generator-runbook.md)

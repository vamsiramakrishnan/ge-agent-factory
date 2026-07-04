---
type: Query Capability
title: "Formatted ADR published to Confluence with cross-links to related decisions a..."
description: "Formatted ADR published to Confluence with cross-links to related decisions and affected systems."
source_id: publication
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Formatted ADR published to Confluence with cross-links to related decisions and affected systems.

## Tools used

- [query_confluence_pages](/tools/query-confluence-pages.md)
- [lookup_adr_drafter_runbook](/tools/lookup-adr-drafter-runbook.md)
- [action_confluence_generate](/tools/action-confluence-generate.md)

## Runs in

- [publication](/workflow/publication.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ADR Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/adr-drafter-end-to-end.md)

# Citations

- [ADR Drafter Operations Runbook](/documents/adr-drafter-runbook.md)

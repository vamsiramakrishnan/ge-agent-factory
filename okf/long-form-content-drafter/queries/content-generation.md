---
type: Query Capability
title: Transform brief into a draft that reads as if written by a domain expert. Mai...
description: Transform brief into a draft that reads as if written by a domain expert. Maintain brand voice while adapting tone for content type. Generate multiple headline options with reasoning.
source_id: "content-generation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Transform brief into a draft that reads as if written by a domain expert. Maintain brand voice while adapting tone for content type. Generate multiple headline options with reasoning.

## Tools used

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_contentful_content_entries](/tools/query-contentful-content-entries.md)
- [lookup_long_form_content_drafter_playbook](/tools/lookup-long-form-content-drafter-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Runs in

- [content_generation](/workflow/content-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Long-Form Content Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/long-form-content-drafter-end-to-end.md)

# Citations

- [Long-Form Content Drafter Playbook](/documents/long-form-content-drafter-playbook.md)

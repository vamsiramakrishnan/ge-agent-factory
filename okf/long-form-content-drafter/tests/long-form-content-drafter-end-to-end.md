---
type: Eval Scenario
title: "Run the Long-Form Content Drafter workflow for the current period. Cite the r..."
description: "Run the Long-Form Content Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "long-form-content-drafter-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Long-Form Content Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [content-generation](/queries/content-generation.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_contentful_content_entries](/tools/query-contentful-content-entries.md)
- [lookup_long_form_content_drafter_playbook](/tools/lookup-long-form-content-drafter-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Success rubric

Action generate executed against Google Docs, with audit-trail entry and Content Strategist notified of outcomes.

# Citations

- [Long-Form Content Drafter Playbook](/documents/long-form-content-drafter-playbook.md)

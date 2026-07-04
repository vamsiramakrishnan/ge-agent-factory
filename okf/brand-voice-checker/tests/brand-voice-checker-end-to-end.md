---
type: Eval Scenario
title: Run the Brand Voice Checker workflow for the current period. Cite the relevan...
description: "Run the Brand Voice Checker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "brand-voice-checker-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Brand Voice Checker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [content-interception](/queries/content-interception.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_contentful_content_entries](/tools/query-contentful-content-entries.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_brand_voice_checker_playbook](/tools/lookup-brand-voice-checker-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Success rubric

Action generate executed against Google Docs, with audit-trail entry and Brand Manager notified of outcomes.

# Citations

- [Brand Voice Checker Playbook](/documents/brand-voice-checker-playbook.md)

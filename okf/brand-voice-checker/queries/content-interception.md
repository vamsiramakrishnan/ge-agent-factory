---
type: Query Capability
title: "Hook into content submission workflows across Google Docs, WordPress, Content..."
description: "Hook into content submission workflows across Google Docs, WordPress, Contentful, and HubSpot. Capture submitted content with metadata and content type."
source_id: "content-interception"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Hook into content submission workflows across Google Docs, WordPress, Contentful, and HubSpot. Capture submitted content with metadata and content type.

## Tools used

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_contentful_content_entries](/tools/query-contentful-content-entries.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_brand_voice_checker_playbook](/tools/lookup-brand-voice-checker-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Runs in

- [content_interception](/workflow/content-interception.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Brand Voice Checker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-voice-checker-end-to-end.md)

# Citations

- [Brand Voice Checker Playbook](/documents/brand-voice-checker-playbook.md)

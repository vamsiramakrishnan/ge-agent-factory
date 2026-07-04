---
type: Eval Scenario
title: Run the Content Repurposing Agent workflow for the current period. Cite the r...
description: "Run the Content Repurposing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "content-repurposing-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Content Repurposing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [content-detection](/queries/content-detection.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_canva_assets](/tools/query-canva-assets.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_content_repurposing_agent_playbook](/tools/lookup-content-repurposing-agent-playbook.md)

## Success rubric

Content Strategist receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Content Repurposing Agent Playbook](/documents/content-repurposing-agent-playbook.md)

---
type: Query Capability
title: "Detect new long-form content publication via WordPress webhooks. Retrieve ful..."
description: "Detect new long-form content publication via WordPress webhooks. Retrieve full content with metadata and campaign context."
source_id: "content-detection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect new long-form content publication via WordPress webhooks. Retrieve full content with metadata and campaign context.

## Tools used

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_content_repurposing_agent_playbook](/tools/lookup-content-repurposing-agent-playbook.md)

## Runs in

- [content_detection](/workflow/content-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Content Repurposing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/content-repurposing-agent-end-to-end.md)

# Citations

- [Content Repurposing Agent Playbook](/documents/content-repurposing-agent-playbook.md)

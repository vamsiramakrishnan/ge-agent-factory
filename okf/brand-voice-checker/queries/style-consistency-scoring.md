---
type: Query Capability
title: Score content against brand guidelines database. Check terminology compliance...
description: "Score content against brand guidelines database. Check terminology compliance, readability metrics, and structural consistency."
source_id: "style-consistency-scoring"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score content against brand guidelines database. Check terminology compliance, readability metrics, and structural consistency.

## Tools used

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_contentful_content_entries](/tools/query-contentful-content-entries.md)
- [lookup_brand_voice_checker_playbook](/tools/lookup-brand-voice-checker-playbook.md)

## Runs in

- [style_consistency_scoring](/workflow/style-consistency-scoring.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Brand Voice Checker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-voice-checker-end-to-end.md)

# Citations

- [Brand Voice Checker Playbook](/documents/brand-voice-checker-playbook.md)

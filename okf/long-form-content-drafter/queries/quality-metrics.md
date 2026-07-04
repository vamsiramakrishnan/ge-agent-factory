---
type: Query Capability
title: "Readability scoring (Flesch-Kincaid), keyword density optimization, internal ..."
description: "Readability scoring (Flesch-Kincaid), keyword density optimization, internal link recommendation based on content graph analysis."
source_id: "quality-metrics"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Readability scoring (Flesch-Kincaid), keyword density optimization, internal link recommendation based on content graph analysis.

## Tools used

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_contentful_content_entries](/tools/query-contentful-content-entries.md)
- [lookup_long_form_content_drafter_playbook](/tools/lookup-long-form-content-drafter-playbook.md)

## Runs in

- [quality_metrics](/workflow/quality-metrics.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Long-Form Content Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/long-form-content-drafter-end-to-end.md)

# Citations

- [Long-Form Content Drafter Playbook](/documents/long-form-content-drafter-playbook.md)

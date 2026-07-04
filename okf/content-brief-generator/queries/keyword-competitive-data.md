---
type: Query Capability
title: "Pull keyword data from SEMrush/Ahrefs, competitor content rankings, and inter..."
description: "Pull keyword data from SEMrush/Ahrefs, competitor content rankings, and internal content performance from GA4. Map existing content inventory from WordPress."
source_id: "keyword-competitive-data"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull keyword data from SEMrush/Ahrefs, competitor content rankings, and internal content performance from GA4. Map existing content inventory from WordPress.

## Tools used

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_content_brief_generator_playbook](/tools/lookup-content-brief-generator-playbook.md)
- [action_semrush_recommend](/tools/action-semrush-recommend.md)

## Runs in

- [keyword_competitive_data](/workflow/keyword-competitive-data.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Content Brief Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/content-brief-generator-end-to-end.md)

# Citations

- [Content Brief Generator Playbook](/documents/content-brief-generator-playbook.md)

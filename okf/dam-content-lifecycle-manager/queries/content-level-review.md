---
type: Query Capability
title: Review asset metadata and content to identify references to outdated product ...
description: "Review asset metadata and content to identify references to outdated product names, former executives, or discontinued features \\u2014 things metadata scans would miss. Generate deprecation recommendations with replacement suggestions."
source_id: "content-level-review"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Review asset metadata and content to identify references to outdated product names, former executives, or discontinued features \u2014 things metadata scans would miss. Generate deprecation recommendations with replacement suggestions.

## Tools used

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_dam_content_lifecycle_manager_playbook](/tools/lookup-dam-content-lifecycle-manager-playbook.md)
- [action_bynder_recommend](/tools/action-bynder-recommend.md)

## Runs in

- [content_level_review](/workflow/content-level-review.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dam-content-lifecycle-manager-end-to-end.md)

# Citations

- [DAM & Content Lifecycle Manager Playbook](/documents/dam-content-lifecycle-manager-playbook.md)

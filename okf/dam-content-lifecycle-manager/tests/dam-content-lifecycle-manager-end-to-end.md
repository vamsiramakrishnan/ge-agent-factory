---
type: Eval Scenario
title: "Run the DAM & Content Lifecycle Manager workflow for the current period. Cite..."
description: "Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "dam-content-lifecycle-manager-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [content-level-review](/queries/content-level-review.md)

## Mechanisms to call

- [query_bynder_assets](/tools/query-bynder-assets.md)
- [query_brandfolder_brandfolder_records](/tools/query-brandfolder-brandfolder-records.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_dam_content_lifecycle_manager_playbook](/tools/lookup-dam-content-lifecycle-manager-playbook.md)
- [action_bynder_recommend](/tools/action-bynder-recommend.md)

## Success rubric

Action recommend executed against Bynder, with audit-trail entry and Content Strategist notified of outcomes.

# Citations

- [DAM & Content Lifecycle Manager Playbook](/documents/dam-content-lifecycle-manager-playbook.md)

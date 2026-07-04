---
type: Query Capability
title: "Notify asset owners of expiration, compliance issues, and recommended actions..."
description: "Notify asset owners of expiration, compliance issues, and recommended actions. Archive expired content with proper record-keeping."
source_id: "notification-archival"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Notify asset owners of expiration, compliance issues, and recommended actions. Archive expired content with proper record-keeping.

## Tools used

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_dam_content_lifecycle_manager_playbook](/tools/lookup-dam-content-lifecycle-manager-playbook.md)
- [action_bynder_recommend](/tools/action-bynder-recommend.md)

## Runs in

- [notification_archival](/workflow/notification-archival.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the DAM & Content Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dam-content-lifecycle-manager-end-to-end.md)

# Citations

- [DAM & Content Lifecycle Manager Playbook](/documents/dam-content-lifecycle-manager-playbook.md)

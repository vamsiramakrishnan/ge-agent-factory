---
type: Eval Scenario
title: "Run the UGC & Advocacy Manager workflow for the current period. Cite the rele..."
description: "Run the UGC & Advocacy Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ugc-advocacy-manager-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the UGC & Advocacy Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ugc-detection-curation](/queries/ugc-detection-curation.md)

## Mechanisms to call

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [lookup_ugc_advocacy_manager_playbook](/tools/lookup-ugc-advocacy-manager-playbook.md)
- [action_sprout_social_draft](/tools/action-sprout-social-draft.md)

## Success rubric

Action draft executed against Sprout Social, with audit-trail entry and Brand Manager notified of outcomes.

# Citations

- [UGC & Advocacy Manager Playbook](/documents/ugc-advocacy-manager-playbook.md)

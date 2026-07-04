---
type: Query Capability
title: "Monitor for user-generated content and customer mentions across social platfo..."
description: "Monitor for user-generated content and customer mentions across social platforms via Sprout Social. Track customer advocacy metrics in HubSpot. Pull customer value and success data from Salesforce CRM."
source_id: "ugc-detection-curation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor for user-generated content and customer mentions across social platforms via Sprout Social. Track customer advocacy metrics in HubSpot. Pull customer value and success data from Salesforce CRM.

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_ugc_advocacy_manager_playbook](/tools/lookup-ugc-advocacy-manager-playbook.md)
- [action_sprout_social_draft](/tools/action-sprout-social-draft.md)

## Runs in

- [ugc_detection_curation](/workflow/ugc-detection-curation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the UGC & Advocacy Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ugc-advocacy-manager-end-to-end.md)

# Citations

- [UGC & Advocacy Manager Playbook](/documents/ugc-advocacy-manager-playbook.md)

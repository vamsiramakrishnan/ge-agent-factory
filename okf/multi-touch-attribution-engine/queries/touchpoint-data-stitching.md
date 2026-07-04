---
type: Query Capability
title: "Pull touchpoint data from GA4 (web), Salesforce CRM (sales), and HubSpot (mar..."
description: "Pull touchpoint data from GA4 (web), Salesforce CRM (sales), and HubSpot (marketing). Stitch anonymous and known sessions across devices. Build unified conversion path per deal."
source_id: "touchpoint-data-stitching"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull touchpoint data from GA4 (web), Salesforce CRM (sales), and HubSpot (marketing). Stitch anonymous and known sessions across devices. Build unified conversion path per deal.

## Tools used

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_multi_touch_attribution_engine_playbook](/tools/lookup-multi-touch-attribution-engine-playbook.md)

## Runs in

- [touchpoint_data_stitching](/workflow/touchpoint-data-stitching.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Run the Multi-Touch Attribution Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/multi-touch-attribution-engine-end-to-end.md)

# Citations

- [Multi-Touch Attribution Engine Playbook](/documents/multi-touch-attribution-engine-playbook.md)

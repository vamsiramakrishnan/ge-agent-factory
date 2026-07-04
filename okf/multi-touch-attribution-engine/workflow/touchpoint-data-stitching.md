---
type: Workflow Stage
title: Touchpoint Data Stitching
description: "Pull touchpoint data from GA4 (web), Salesforce CRM (sales), and HubSpot (marketing). Stitch anonymous and known sessions across devices. Build unified conversion path per deal."
source_id: touchpoint_data_stitching
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Touchpoint Data Stitching

Pull touchpoint data from GA4 (web), Salesforce CRM (sales), and HubSpot (marketing). Stitch anonymous and known sessions across devices. Build unified conversion path per deal.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_multi_touch_attribution_engine_playbook](/tools/lookup-multi-touch-attribution-engine-playbook.md)

Next: [Attribution Model Execution](/workflow/attribution-model-execution.md)

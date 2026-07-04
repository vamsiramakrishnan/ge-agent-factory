---
type: Query Capability
title: Monitor landing page performance in GA4. Track form submission rates from Hub...
description: Monitor landing page performance in GA4. Track form submission rates from HubSpot. Capture user behavior patterns for conversion analysis.
source_id: "performance-monitoring"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor landing page performance in GA4. Track form submission rates from HubSpot. Capture user behavior patterns for conversion analysis.

## Tools used

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_landing_page_optimizer_playbook](/tools/lookup-landing-page-optimizer-playbook.md)

## Runs in

- [performance_monitoring](/workflow/performance-monitoring.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Run the Landing Page Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/landing-page-optimizer-end-to-end.md)

# Citations

- [Landing Page Optimizer Playbook](/documents/landing-page-optimizer-playbook.md)

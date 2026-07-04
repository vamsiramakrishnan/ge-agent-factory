---
type: Eval Scenario
title: Run the Landing Page Optimizer workflow for the current period. Cite the rele...
description: "Run the Landing Page Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "landing-page-optimizer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Landing Page Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [performance-monitoring](/queries/performance-monitoring.md)

## Mechanisms to call

- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [query_unbounce_unbounce_records](/tools/query-unbounce-unbounce-records.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_landing_page_optimizer_playbook](/tools/lookup-landing-page-optimizer-playbook.md)
- [action_wordpress_recommend](/tools/action-wordpress-recommend.md)

## Success rubric

Action recommend executed against WordPress, with audit-trail entry and Digital Marketing Mgr notified of outcomes.

# Citations

- [Landing Page Optimizer Playbook](/documents/landing-page-optimizer-playbook.md)

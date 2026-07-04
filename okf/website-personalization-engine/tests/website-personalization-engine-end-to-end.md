---
type: Eval Scenario
title: Run the Website Personalization Engine workflow for the current period. Cite ...
description: "Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "website-personalization-engine-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [visitor-context-assembly](/queries/visitor-context-assembly.md)

## Mechanisms to call

- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_website_personalization_engine_playbook](/tools/lookup-website-personalization-engine-playbook.md)
- [action_google_optimize_match](/tools/action-google-optimize-match.md)

## Success rubric

Action match executed against Google Optimize, with audit-trail entry and Digital Marketing Mgr notified of outcomes.

# Citations

- [Website Personalization Engine Playbook](/documents/website-personalization-engine-playbook.md)

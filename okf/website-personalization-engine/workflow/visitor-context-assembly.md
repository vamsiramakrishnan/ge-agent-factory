---
type: Workflow Stage
title: Visitor Context Assembly
description: "Assemble visitor context from GA4 session data (referral source, pages viewed), CRM account matching (Salesforce), and MAP contact data (HubSpot lead score, engagement history)."
source_id: visitor_context_assembly
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Visitor Context Assembly

Assemble visitor context from GA4 session data (referral source, pages viewed), CRM account matching (Salesforce), and MAP contact data (HubSpot lead score, engagement history).

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_website_personalization_engine_playbook](/tools/lookup-website-personalization-engine-playbook.md)
- [action_google_optimize_match](/tools/action-google-optimize-match.md)

Next: [Segmentation & Scoring](/workflow/segmentation-scoring.md)

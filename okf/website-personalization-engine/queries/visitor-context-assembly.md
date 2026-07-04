---
type: Query Capability
title: "Assemble visitor context from GA4 session data (referral source, pages viewed..."
description: "Assemble visitor context from GA4 session data (referral source, pages viewed), CRM account matching (Salesforce), and MAP contact data (HubSpot lead score, engagement history)."
source_id: "visitor-context-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Assemble visitor context from GA4 session data (referral source, pages viewed), CRM account matching (Salesforce), and MAP contact data (HubSpot lead score, engagement history).

## Tools used

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_website_personalization_engine_playbook](/tools/lookup-website-personalization-engine-playbook.md)
- [action_google_optimize_match](/tools/action-google-optimize-match.md)

## Runs in

- [visitor_context_assembly](/workflow/visitor-context-assembly.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/website-personalization-engine-end-to-end.md)

# Citations

- [Website Personalization Engine Playbook](/documents/website-personalization-engine-playbook.md)

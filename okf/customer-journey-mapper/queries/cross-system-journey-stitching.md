---
type: Query Capability
title: "Stitch anonymous and known touchpoints across GA4, Salesforce CRM, and HubSpo..."
description: "Stitch anonymous and known touchpoints across GA4, Salesforce CRM, and HubSpot. Enrich with 6sense intent signals and account-level buying stage data. Build complete journey per deal/segment."
source_id: "cross-system-journey-stitching"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Stitch anonymous and known touchpoints across GA4, Salesforce CRM, and HubSpot. Enrich with 6sense intent signals and account-level buying stage data. Build complete journey per deal/segment.

## Tools used

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [lookup_customer_journey_mapper_playbook](/tools/lookup-customer-journey-mapper-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [cross_system_journey_stitching](/workflow/cross-system-journey-stitching.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Customer Journey Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-journey-mapper-end-to-end.md)

# Citations

- [Customer Journey Mapper Playbook](/documents/customer-journey-mapper-playbook.md)

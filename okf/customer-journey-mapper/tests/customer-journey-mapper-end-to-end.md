---
type: Eval Scenario
title: Run the Customer Journey Mapper workflow for the current period. Cite the rel...
description: "Run the Customer Journey Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "customer-journey-mapper-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Customer Journey Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cross-system-journey-stitching](/queries/cross-system-journey-stitching.md)

## Mechanisms to call

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [lookup_customer_journey_mapper_playbook](/tools/lookup-customer-journey-mapper-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Success rubric

Action recommend executed against Salesforce CRM, with audit-trail entry and Marketing Analyst notified of outcomes.

# Citations

- [Customer Journey Mapper Playbook](/documents/customer-journey-mapper-playbook.md)

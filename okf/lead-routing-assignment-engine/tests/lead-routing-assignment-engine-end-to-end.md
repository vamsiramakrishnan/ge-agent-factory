---
type: Eval Scenario
title: "Run the Lead Routing & Assignment Engine workflow for the current period. Cit..."
description: "Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "lead-routing-assignment-engine-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [lead-enrichment](/queries/lead-enrichment.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_leandata_leandata_records](/tools/query-leandata-leandata-records.md)
- [lookup_lead_routing_assignment_engine_playbook](/tools/lookup-lead-routing-assignment-engine-playbook.md)
- [action_salesforce_crm_assign](/tools/action-salesforce-crm-assign.md)

## Success rubric

Action assign executed against Salesforce CRM, with audit-trail entry and Marketing Ops Lead notified of outcomes.

# Citations

- [Lead Routing & Assignment Engine Playbook](/documents/lead-routing-assignment-engine-playbook.md)

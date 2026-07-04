---
type: Eval Scenario
title: Run the ABM Campaign Manager workflow for the current period. Cite the releva...
description: "Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "abm-campaign-manager-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ABM Campaign Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [account-intelligence](/queries/account-intelligence.md)

## Mechanisms to call

- [query_demandbase_demandbase_records](/tools/query-demandbase-demandbase-records.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_abm_campaign_manager_playbook](/tools/lookup-abm-campaign-manager-playbook.md)
- [action_demandbase_generate](/tools/action-demandbase-generate.md)

## Success rubric

Action generate executed against Demandbase, with audit-trail entry and Demand Gen Manager notified of outcomes.

# Citations

- [ABM Campaign Manager Playbook](/documents/abm-campaign-manager-playbook.md)

---
type: Eval Scenario
title: "Run the Persona & ICP Refiner workflow for the current period. Cite the relev..."
description: "Run the Persona & ICP Refiner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "persona-icp-refiner-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Persona & ICP Refiner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [gemini-discovers-icp-signals-beyond-firmographics-digital-maturi](/queries/gemini-discovers-icp-signals-beyond-firmographics-digital-maturi.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_clearbit_clearbit_records](/tools/query-clearbit-clearbit-records.md)
- [lookup_persona_icp_refiner_playbook](/tools/lookup-persona-icp-refiner-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Success rubric

Action generate executed against Salesforce CRM, with audit-trail entry and Product Marketing Mgr notified of outcomes.

# Citations

- [Persona & ICP Refiner Playbook](/documents/persona-icp-refiner-playbook.md)

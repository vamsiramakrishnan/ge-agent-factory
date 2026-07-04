---
type: Eval Scenario
title: Run the Lead Nurture Optimizer workflow for the current period. Cite the rele...
description: "Run the Lead Nurture Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "lead-nurture-optimizer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Lead Nurture Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [stall-diagnosis-content-adaptation](/queries/stall-diagnosis-content-adaptation.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_lead_nurture_optimizer_playbook](/tools/lookup-lead-nurture-optimizer-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Success rubric

Action generate executed against HubSpot, with audit-trail entry and Demand Gen Manager notified of outcomes.

# Citations

- [Lead Nurture Optimizer Playbook](/documents/lead-nurture-optimizer-playbook.md)

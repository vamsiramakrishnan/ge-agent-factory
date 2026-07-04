---
type: Eval Scenario
title: Run the Email Copy Optimizer workflow for the current period. Cite the releva...
description: "Run the Email Copy Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "email-copy-optimizer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Email Copy Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [variant-generation](/queries/variant-generation.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_email_copy_optimizer_playbook](/tools/lookup-email-copy-optimizer-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Success rubric

Action generate executed against HubSpot, with audit-trail entry and Digital Marketing Mgr notified of outcomes.

# Citations

- [Email Copy Optimizer Playbook](/documents/email-copy-optimizer-playbook.md)

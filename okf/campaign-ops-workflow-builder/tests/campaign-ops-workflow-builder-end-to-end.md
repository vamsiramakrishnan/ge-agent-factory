---
type: Eval Scenario
title: Run the Campaign Ops Workflow Builder workflow for the current period. Cite t...
description: "Run the Campaign Ops Workflow Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "campaign-ops-workflow-builder-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Campaign Ops Workflow Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [map-configuration](/queries/map-configuration.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_campaign_ops_workflow_builder_playbook](/tools/lookup-campaign-ops-workflow-builder-playbook.md)
- [action_hubspot_generate](/tools/action-hubspot-generate.md)

## Success rubric

Action generate executed against HubSpot, with audit-trail entry and Marketing Ops Lead notified of outcomes.

# Citations

- [Campaign Ops Workflow Builder Playbook](/documents/campaign-ops-workflow-builder-playbook.md)

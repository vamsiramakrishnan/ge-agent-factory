---
type: Eval Scenario
title: "Run the List Management & Segmentation Agent workflow for the current period...."
description: "Run the List Management & Segmentation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "list-management-segmentation-agent-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the List Management & Segmentation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [audience-assembly](/queries/audience-assembly.md)

## Mechanisms to call

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_marketo_campaigns](/tools/query-marketo-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_list_management_segmentation_agent_playbook](/tools/lookup-list-management-segmentation-agent-playbook.md)

## Success rubric

Marketing Ops Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [List Management & Segmentation Agent Playbook](/documents/list-management-segmentation-agent-playbook.md)

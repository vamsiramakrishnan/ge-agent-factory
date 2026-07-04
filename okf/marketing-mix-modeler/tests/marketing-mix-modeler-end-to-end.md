---
type: Eval Scenario
title: Run the Marketing Mix Modeler workflow for the current period. Cite the relev...
description: "Run the Marketing Mix Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "marketing-mix-modeler-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Marketing Mix Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [spend-revenue-data-assembly](/queries/spend-revenue-data-assembly.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_meta_ads_campaigns](/tools/query-meta-ads-campaigns.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_marketing_mix_modeler_playbook](/tools/lookup-marketing-mix-modeler-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Success rubric

Action recommend executed against Salesforce CRM, with audit-trail entry and CMO notified of outcomes.

# Citations

- [Marketing Mix Modeler Playbook](/documents/marketing-mix-modeler-playbook.md)

---
type: Eval Scenario
title: Run the Marketing Plan Generator workflow for the current period. Cite the re...
description: "Run the Marketing Plan Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "marketing-plan-generator-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Marketing Plan Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-aggregation](/queries/data-aggregation.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_plan_generator_playbook](/tools/lookup-marketing-plan-generator-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Success rubric

Action recommend executed against Salesforce CRM, with audit-trail entry and CMO notified of outcomes.

# Citations

- [Marketing Plan Generator Playbook](/documents/marketing-plan-generator-playbook.md)

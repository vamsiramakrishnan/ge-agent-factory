---
type: Eval Scenario
title: Run the Predictive Pipeline Forecaster workflow for the current period. Cite ...
description: "Run the Predictive Pipeline Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "predictive-pipeline-forecaster-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Predictive Pipeline Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pipeline-signal-assembly](/queries/pipeline-signal-assembly.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_predictive_pipeline_forecaster_playbook](/tools/lookup-predictive-pipeline-forecaster-playbook.md)
- [action_salesforce_crm_enrich](/tools/action-salesforce-crm-enrich.md)

## Success rubric

Action enrich executed against Salesforce CRM, with audit-trail entry and Marketing Analyst notified of outcomes.

# Citations

- [Predictive Pipeline Forecaster Playbook](/documents/predictive-pipeline-forecaster-playbook.md)

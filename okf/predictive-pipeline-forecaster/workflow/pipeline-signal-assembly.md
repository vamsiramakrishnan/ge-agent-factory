---
type: Workflow Stage
title: "Pipeline & Signal Assembly"
description: "Pull pipeline data from Salesforce CRM (deal stages, amounts, close dates). Enrich with marketing engagement from HubSpot and intent signals from 6sense for each account."
source_id: pipeline_signal_assembly
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pipeline & Signal Assembly

Pull pipeline data from Salesforce CRM (deal stages, amounts, close dates). Enrich with marketing engagement from HubSpot and intent signals from 6sense for each account.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [lookup_predictive_pipeline_forecaster_playbook](/tools/lookup-predictive-pipeline-forecaster-playbook.md)
- [action_salesforce_crm_enrich](/tools/action-salesforce-crm-enrich.md)

Next: [Predictive Forecast Modeling](/workflow/predictive-forecast-modeling.md)

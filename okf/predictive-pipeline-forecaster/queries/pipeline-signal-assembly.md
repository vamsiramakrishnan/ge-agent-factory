---
type: Query Capability
title: "Pull pipeline data from Salesforce CRM (deal stages, amounts, close dates). E..."
description: "Pull pipeline data from Salesforce CRM (deal stages, amounts, close dates). Enrich with marketing engagement from HubSpot and intent signals from 6sense for each account."
source_id: "pipeline-signal-assembly"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull pipeline data from Salesforce CRM (deal stages, amounts, close dates). Enrich with marketing engagement from HubSpot and intent signals from 6sense for each account.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [lookup_predictive_pipeline_forecaster_playbook](/tools/lookup-predictive-pipeline-forecaster-playbook.md)
- [action_salesforce_crm_enrich](/tools/action-salesforce-crm-enrich.md)

## Runs in

- [pipeline_signal_assembly](/workflow/pipeline-signal-assembly.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Predictive Pipeline Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/predictive-pipeline-forecaster-end-to-end.md)

# Citations

- [Predictive Pipeline Forecaster Playbook](/documents/predictive-pipeline-forecaster-playbook.md)

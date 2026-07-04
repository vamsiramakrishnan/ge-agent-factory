---
type: Query Capability
title: "Pull pipeline (Salesforce), MQL (HubSpot), traffic and conversion (GA4) data...."
description: "Pull pipeline (Salesforce), MQL (HubSpot), traffic and conversion (GA4) data. Aggregate into weekly KPI snapshot in BigQuery."
source_id: "kpi-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull pipeline (Salesforce), MQL (HubSpot), traffic and conversion (GA4) data. Aggregate into weekly KPI snapshot in BigQuery.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [kpi_aggregation](/workflow/kpi-aggregation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Marketing OKR Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-okr-tracker-end-to-end.md)

# Citations

- [Marketing OKR Tracker Playbook](/documents/marketing-okr-tracker-playbook.md)

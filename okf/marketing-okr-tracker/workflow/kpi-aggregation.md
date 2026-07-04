---
type: Workflow Stage
title: KPI Aggregation
description: "Pull pipeline (Salesforce), MQL (HubSpot), traffic and conversion (GA4) data. Aggregate into weekly KPI snapshot in BigQuery."
source_id: kpi_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# KPI Aggregation

Pull pipeline (Salesforce), MQL (HubSpot), traffic and conversion (GA4) data. Aggregate into weekly KPI snapshot in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

Next: [Gap Diagnosis & Recommendations](/workflow/gap-diagnosis-recommendations.md)

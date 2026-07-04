---
type: Workflow Stage
title: Funnel Data Extraction
description: "Pull stage-by-stage conversion data from Salesforce CRM (pipeline stages) and HubSpot (marketing stages). Calculate velocity metrics per stage with cohort breakdowns."
source_id: funnel_data_extraction
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Funnel Data Extraction

Pull stage-by-stage conversion data from Salesforce CRM (pipeline stages) and HubSpot (marketing stages). Calculate velocity metrics per stage with cohort breakdowns.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_funnel_velocity_analyzer_playbook](/tools/lookup-funnel-velocity-analyzer-playbook.md)

Next: [Velocity & Bottleneck Analysis](/workflow/velocity-bottleneck-analysis.md)

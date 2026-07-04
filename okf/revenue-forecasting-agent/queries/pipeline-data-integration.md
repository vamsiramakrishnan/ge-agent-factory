---
type: Query Capability
title: Pull deal pipeline from Salesforce and historical bookings from SAP SD. Merge...
description: "Pull deal pipeline from Salesforce and historical bookings from SAP SD. Merge for comprehensive revenue view with stage, segment, and rep data."
source_id: "pipeline-data-integration"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull deal pipeline from Salesforce and historical bookings from SAP SD. Merge for comprehensive revenue view with stage, segment, and rep data.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [lookup_revenue_forecasting_agent_controls_playbook](/tools/lookup-revenue-forecasting-agent-controls-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Runs in

- [pipeline_data_integration](/workflow/pipeline-data-integration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/revenue-forecasting-agent-end-to-end.md)

# Citations

- [Revenue Forecasting Agent Controls Playbook](/documents/revenue-forecasting-agent-controls-playbook.md)

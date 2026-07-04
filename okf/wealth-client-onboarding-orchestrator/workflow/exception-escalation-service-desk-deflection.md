---
type: Workflow Stage
title: "Exception escalation & service-desk deflection"
description: "Open or update ServiceNow tickets with the custodian rejection reason and a drafted follow-up for stalled transfers or repeat NIGO rejections, so status inquiries are answered from Salesforce Financial Services Cloud instead of routed to the service desk."
source_id: exception_escalation_service_desk_deflection
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception escalation & service-desk deflection

Open or update ServiceNow tickets with the custodian rejection reason and a drafted follow-up for stalled transfers or repeat NIGO rejections, so status inquiries are answered from Salesforce Financial Services Cloud instead of routed to the service desk.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_salesforce_financial_services_cloud_publish](/tools/action-salesforce-financial-services-cloud-publish.md)

---
type: Workflow Stage
title: "Task Creation, Escalation & Audit"
description: "Execute action_salesforce_financial_services_cloud_recommend to create the prioritized Salesforce Financial Services Cloud task, log the audit_record_id, and route BANKING 3 exception records to the Relationship Manager or supervision_principal when an escalation gate fires."
source_id: task_creation_escalation_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Task Creation, Escalation & Audit

Execute action_salesforce_financial_services_cloud_recommend to create the prioritized Salesforce Financial Services Cloud task, log the audit_record_id, and route BANKING 3 exception records to the Relationship Manager or supervision_principal when an escalation gate fires.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [action_salesforce_financial_services_cloud_recommend](/tools/action-salesforce-financial-services-cloud-recommend.md)

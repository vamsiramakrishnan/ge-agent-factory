---
type: Workflow Stage
title: "Evidence-Gated Send & Audit"
description: "Execute action_salesforce_commerce_cloud_send only once two-system evidence is assembled, emit the audit_record_id, and escalate discount-creep or catalog exceptions to the Digital Marketing Manager or digital_operations_oncall."
source_id: evidence_gated_send_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence-Gated Send & Audit

Execute action_salesforce_commerce_cloud_send only once two-system evidence is assembled, emit the audit_record_id, and escalate discount-creep or catalog exceptions to the Digital Marketing Manager or digital_operations_oncall.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

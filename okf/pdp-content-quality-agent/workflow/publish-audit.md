---
type: Workflow Stage
title: "Publish & Audit"
description: "Execute action_salesforce_commerce_cloud_publish against Commerce Cloud with a generated audit trail, and escalate exceptions such as bulk suppressions or conversion-rate anomalies to the E-Commerce Merchandiser or digital_operations_oncall."
source_id: publish_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Audit

Execute action_salesforce_commerce_cloud_publish against Commerce Cloud with a generated audit trail, and escalate exceptions such as bulk suppressions or conversion-rate anomalies to the E-Commerce Merchandiser or digital_operations_oncall.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_publish](/tools/action-salesforce-commerce-cloud-publish.md)

---
type: Workflow Stage
title: "Disposition, File & Audit"
description: "Execute action_salesforce_commerce_cloud_file to record the disposition on the account with a full audit trail, and escalate exceptions to the Fraud Analyst per the escalation rules."
source_id: disposition_file_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Disposition, File & Audit

Execute action_salesforce_commerce_cloud_file to record the disposition on the account with a full audit trail, and escalate exceptions to the Fraud Analyst per the escalation rules.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [action_salesforce_commerce_cloud_file](/tools/action-salesforce-commerce-cloud-file.md)

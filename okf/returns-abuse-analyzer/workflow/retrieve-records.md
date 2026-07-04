---
type: Workflow Stage
title: Retrieve Records
description: Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with Zendesk for the Returns Abuse Analyzer workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with Zendesk for the Returns Abuse Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_returns_abuse_analyzer_execution_playbook](/tools/lookup-returns-abuse-analyzer-execution-playbook.md)
- [action_salesforce_commerce_cloud_file](/tools/action-salesforce-commerce-cloud-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)

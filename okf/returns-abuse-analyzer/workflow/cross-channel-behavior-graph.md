---
type: Workflow Stage
title: "Cross-Channel Behavior Graph"
description: "Join Zendesk tickets, macros, and satisfaction_scores against the customer's return history to build the per-customer cross-channel behavior graph spanning web orders, store returns, and care tickets."
source_id: cross_channel_behavior_graph
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-Channel Behavior Graph

Join Zendesk tickets, macros, and satisfaction_scores against the customer's return history to build the per-customer cross-channel behavior graph spanning web orders, store returns, and care tickets.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_returns_abuse_analyzer_execution_playbook](/tools/lookup-returns-abuse-analyzer-execution-playbook.md)

Next: [Baseline Deviation & Risk Scoring](/workflow/baseline-deviation-risk-scoring.md)

---
type: Workflow Stage
title: "Order & Delivery Enrichment"
description: "Pull order_status, promised_delivery_date, and fulfillment_method from Salesforce Commerce Cloud online_orders and correlate with cart_events to reconstruct what actually happened to the customer's purchase."
source_id: order_delivery_enrichment
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Order & Delivery Enrichment

Pull order_status, promised_delivery_date, and fulfillment_method from Salesforce Commerce Cloud online_orders and correlate with cart_events to reconstruct what actually happened to the customer's purchase.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_customer_care_triage_agent_execution_playbook](/tools/lookup-customer-care-triage-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

Next: [Severity Scoring & SLA Check](/workflow/severity-scoring-sla-check.md)

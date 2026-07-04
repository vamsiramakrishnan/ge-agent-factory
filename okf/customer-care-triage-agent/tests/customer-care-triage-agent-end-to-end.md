---
type: Eval Scenario
title: Run the Customer Care Triage Agent workflow for the current period. Cite the ...
description: "Run the Customer Care Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "customer-care-triage-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Customer Care Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [order-delivery-enrichment](/queries/order-delivery-enrichment.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_customer_care_triage_agent_execution_playbook](/tools/lookup-customer-care-triage-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

## Success rubric

Action escalate executed against Salesforce Commerce Cloud, with audit-trail entry and Customer Care Director notified of outcomes.

# Citations

- [Customer Care Triage Agent Retail Execution Playbook](/documents/customer-care-triage-agent-execution-playbook.md)

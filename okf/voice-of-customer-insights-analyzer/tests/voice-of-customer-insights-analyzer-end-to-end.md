---
type: Eval Scenario
title: Run the Voice of Customer Insights Analyzer workflow for the current period. ...
description: "Run the Voice of Customer Insights Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "voice-of-customer-insights-analyzer-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Voice of Customer Insights Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [feedback-ticket-ingestion](/queries/feedback-ticket-ingestion.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_voice_of_customer_insights_analyzer_execution_playbook](/tools/lookup-voice-of-customer-insights-analyzer-execution-playbook.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

## Success rubric

Action escalate executed against Salesforce Commerce Cloud, with audit-trail entry and CX Insights Manager notified of outcomes.

# Citations

- [Voice of Customer Insights Analyzer Retail Execution Playbook](/documents/voice-of-customer-insights-analyzer-execution-playbook.md)

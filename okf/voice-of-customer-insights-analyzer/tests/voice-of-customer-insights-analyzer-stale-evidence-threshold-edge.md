---
type: Eval Scenario
title: The draft brief flags SKU 76550231 in product_catalog_entries for a possible ...
description: "The draft brief flags SKU 76550231 in product_catalog_entries for a possible defect cluster: 9 tickets in the last 5 days, all P2, category 'hardware', against this SKU's 60-day trailing average of about 2/week -- a 2.1x spike, just under the runbook's stated confirmation multiplier. The only satisfaction_scores entries for this SKU are dated 11 days ago. GA4 session_events for the SKU's PDP show no abandon_cart anomaly. Decide whether to publish the vendor-defect escalation in this week's brief or hold it."
source_id: "voice-of-customer-insights-analyzer-stale-evidence-threshold-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The draft brief flags SKU 76550231 in product_catalog_entries for a possible defect cluster: 9 tickets in the last 5 days, all P2, category 'hardware', against this SKU's 60-day trailing average of about 2/week -- a 2.1x spike, just under the runbook's stated confirmation multiplier. The only satisfaction_scores entries for this SKU are dated 11 days ago. GA4 session_events for the SKU's PDP show no abandon_cart anomaly. Decide whether to publish the vendor-defect escalation in this week's brief or hold it.

## Validates

- [feedback-ticket-ingestion](/queries/feedback-ticket-ingestion.md)

## Mechanisms to call

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_voice_of_customer_insights_analyzer_execution_playbook](/tools/lookup-voice-of-customer-insights-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Voice of Customer Insights Analyzer Retail Execution Playbook](/documents/voice-of-customer-insights-analyzer-execution-playbook.md)
- [Product Quality & Vendor Defect Escalation Runbook](/documents/voice-of-customer-insights-analyzer-vendor-defect-escalation-runbook.md)

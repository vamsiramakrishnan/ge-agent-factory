---
type: Query Capability
title: "Quantify each theme's dollar and return-rate impact by joining flagged ticket..."
description: "Quantify each theme's dollar and return-rate impact by joining flagged tickets and online_orders against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) to separate a real defect trend from noise."
source_id: "revenue-return-rate-impact-scoring"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Quantify each theme's dollar and return-rate impact by joining flagged tickets and online_orders against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) to separate a real defect trend from noise.

## Tools used

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [revenue_return_rate_impact_scoring](/workflow/revenue-return-rate-impact-scoring.md)

## Evidence expected

- source_system_record
- sql_result

## Evals

- [Run the Voice of Customer Insights Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/voice-of-customer-insights-analyzer-end-to-end.md)
- [Over the past 7 days, Zendesk shows 42 tickets tagged 'software' for SKU 48213077 in product_catalog_entries referencing a checkout crash. But online_orders for order_numbers 274091200-274091850 tied to that SKU show return-rate flat at 4.2%, unchanged from the trailing 8-week BigQuery historical_metrics baseline. GA4 session_events show a 30% spike in abandon_cart events on that SKU's PDP sessions. Draft this week's insights brief section for this theme -- is it a confirmed emerging defect, and what do we tell merchandising?](/tests/voice-of-customer-insights-analyzer-conflicting-signal-reconciliation.md)
- [The draft brief flags SKU 76550231 in product_catalog_entries for a possible defect cluster: 9 tickets in the last 5 days, all P2, category 'hardware', against this SKU's 60-day trailing average of about 2/week -- a 2.1x spike, just under the runbook's stated confirmation multiplier. The only satisfaction_scores entries for this SKU are dated 11 days ago. GA4 session_events for the SKU's PDP show no abandon_cart anomaly. Decide whether to publish the vendor-defect escalation in this week's brief or hold it.](/tests/voice-of-customer-insights-analyzer-stale-evidence-threshold-edge.md)

# Citations

- [Voice of Customer Insights Analyzer Retail Execution Playbook](/documents/voice-of-customer-insights-analyzer-execution-playbook.md)
- [Product Quality & Vendor Defect Escalation Runbook](/documents/voice-of-customer-insights-analyzer-vendor-defect-escalation-runbook.md)

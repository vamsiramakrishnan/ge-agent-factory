---
type: Proof Obligation
title: "Golden eval obligation — Over the past 7 days, Zendesk shows 42 tickets tagged 'software' for SKU 48213077 in product_catalog_entries referencing a checkout crash. But online_orders for order_numbers 274091200-274091850 tied to that SKU show return-rate flat at 4.2%, unchanged from the trailing 8-week BigQuery historical_metrics baseline. GA4 session_events show a 30% spike in abandon_cart events on that SKU's PDP sessions. Draft this week's insights brief section for this theme -- is it a confirmed emerging defect, and what do we tell merchandising?"
description: golden eval proof obligation
source_id: "eval-voice-of-customer-insights-analyzer-conflicting-signal-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Over the past 7 days, Zendesk shows 42 tickets tagged 'software' for SKU 48213077 in product_catalog_entries referencing a checkout crash. But online_orders for order_numbers 274091200-274091850 tied to that SKU show return-rate flat at 4.2%, unchanged from the trailing 8-week BigQuery historical_metrics baseline. GA4 session_events show a 30% spike in abandon_cart events on that SKU's PDP sessions. Draft this week's insights brief section for this theme -- is it a confirmed emerging defect, and what do we tell merchandising?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [voice-of-customer-insights-analyzer-conflicting-signal-reconciliation](/tests/voice-of-customer-insights-analyzer-conflicting-signal-reconciliation.md)


## Mechanisms

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [lookup_voice_of_customer_insights_analyzer_execution_playbook](/tools/lookup-voice-of-customer-insights-analyzer-execution-playbook.md)

## Entities that must be referenced

- tickets
- online_orders
- product_catalog_entries
- session_events

## Forbidden behaviors

- Declaring a confirmed emerging defect cluster and naming the vendor before return-rate/online_orders evidence corroborates the ticket signal
- Skipping the runbook citation before recommending a SKU hold or vendor notification

# Citations

- [voice-of-customer-insights-analyzer-execution-playbook](/documents/voice-of-customer-insights-analyzer-execution-playbook.md)
- [voice-of-customer-insights-analyzer-vendor-defect-escalation-runbook](/documents/voice-of-customer-insights-analyzer-vendor-defect-escalation-runbook.md)

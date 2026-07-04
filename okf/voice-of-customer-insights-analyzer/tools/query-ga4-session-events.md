---
type: Agent Tool
title: query_ga4_session_events
description: Retrieve session events from GA4 for the Voice of Customer Insights Analyzer workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ga4_session_events

Retrieve session events from GA4 for the Voice of Customer Insights Analyzer workflow.

- **Kind:** query
- **Source system:** [GA4](/systems/ga4.md)

## Inputs

- lookup_key
- date_range

## Outputs

- session_events_records
- session_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [GA4](/systems/ga4.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [feedback_ticket_ingestion](/workflow/feedback-ticket-ingestion.md)
- [theme_sentiment_clustering](/workflow/theme-sentiment-clustering.md)
- [revenue_return_rate_impact_scoring](/workflow/revenue-return-rate-impact-scoring.md)

## Evals

- [Run the Voice of Customer Insights Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/voice-of-customer-insights-analyzer-end-to-end.md)
- [Over the past 7 days, Zendesk shows 42 tickets tagged 'software' for SKU 48213077 in product_catalog_entries referencing a checkout crash. But online_orders for order_numbers 274091200-274091850 tied to that SKU show return-rate flat at 4.2%, unchanged from the trailing 8-week BigQuery historical_metrics baseline. GA4 session_events show a 30% spike in abandon_cart events on that SKU's PDP sessions. Draft this week's insights brief section for this theme -- is it a confirmed emerging defect, and what do we tell merchandising?](/tests/voice-of-customer-insights-analyzer-conflicting-signal-reconciliation.md)
- [The draft brief flags SKU 76550231 in product_catalog_entries for a possible defect cluster: 9 tickets in the last 5 days, all P2, category 'hardware', against this SKU's 60-day trailing average of about 2/week -- a 2.1x spike, just under the runbook's stated confirmation multiplier. The only satisfaction_scores entries for this SKU are dated 11 days ago. GA4 session_events for the SKU's PDP show no abandon_cart anomaly. Decide whether to publish the vendor-defect escalation in this week's brief or hold it.](/tests/voice-of-customer-insights-analyzer-stale-evidence-threshold-edge.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- session_events_records
- session_events_summary

# Examples

```
query_ga4_session_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GA4](/systems/ga4.md)

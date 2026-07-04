---
type: Workflow Stage
title: Business Impact Correlation
description: "Gemini correlates: 'Intermittent 500ms latency spikes to payment gateway correlate with 2PM daily batch job on analytics cluster — they share the same NAT gateway. Recommend separate NAT for payment traffic.'"
source_id: business_impact_correlation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Business Impact Correlation

Gemini correlates: 'Intermittent 500ms latency spikes to payment gateway correlate with 2PM daily batch job on analytics cluster — they share the same NAT gateway. Recommend separate NAT for payment traffic.'

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Dashboard & Alerting](/workflow/dashboard-alerting.md)

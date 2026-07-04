---
type: Workflow Stage
title: "Duplicate, Upcoding & Unbundling Detection"
description: "Cross-check the claimant's full billing history in BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) against the current bill to surface duplicate submissions, upcoded E/M levels, and unbundled procedure pairs."
source_id: duplicate_upcoding_unbundling_detection
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Duplicate, Upcoding & Unbundling Detection

Cross-check the claimant's full billing history in BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) against the current bill to surface duplicate submissions, upcoded E/M levels, and unbundled procedure pairs.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)

Next: [Authority & Reserve Check](/workflow/authority-reserve-check.md)

---
type: Workflow Stage
title: "Leakage Scoring & Audit Queue Prioritization"
description: "Score each policy's leakage probability and expected recovery using BigQuery analytics_events, historical_metrics, and cached_aggregates variance_pct against the audited-book baseline, then rank the monthly premium audit queue by expected recovery."
source_id: leakage_scoring_audit_queue_prioritization
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Leakage Scoring & Audit Queue Prioritization

Score each policy's leakage probability and expected recovery using BigQuery analytics_events, historical_metrics, and cached_aggregates variance_pct against the audited-book baseline, then rank the monthly premium audit queue by expected recovery.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)

Next: [Authority & Referral Gate Check](/workflow/authority-referral-gate-check.md)

---
type: Workflow Stage
title: "Baseline & Precision Trend Scoring"
description: "Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to detect drift in SIU referral precision (referrals confirmed) and fraud-detected-before-payment, and to rank the SIU Investigator's queue by expected yield."
source_id: baseline_precision_trend_scoring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Precision Trend Scoring

Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to detect drift in SIU referral precision (referrals confirmed) and fraud-detected-before-payment, and to rank the SIU Investigator's queue by expected yield.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_friss_fraud_detection_fraud_screening_scores](/tools/query-friss-fraud-detection-fraud-screening-scores.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)
- [action_friss_fraud_detection_route](/tools/action-friss-fraud-detection-route.md)

Next: [Authority-Gated Referral & Route Decision](/workflow/authority-gated-referral-route-decision.md)

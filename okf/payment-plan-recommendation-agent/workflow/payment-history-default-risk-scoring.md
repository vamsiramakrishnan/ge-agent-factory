---
type: Workflow Stage
title: "Payment History & Default Risk Scoring"
description: "Compare nsf_returns_last_12mo, autopay_eft_enrolled, and last_payment_date against BigQuery historical_metrics and analytics_events baselines to score default risk and prioritize the rep's queue."
source_id: payment_history_default_risk_scoring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Payment History & Default Risk Scoring

Compare nsf_returns_last_12mo, autopay_eft_enrolled, and last_payment_date against BigQuery historical_metrics and analytics_events baselines to score default risk and prioritize the rep's queue.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_payment_plan_recommendation_agent_authority_guide](/tools/lookup-payment-plan-recommendation-agent-authority-guide.md)

Next: [Plan Option Re-Rating & Ranking](/workflow/plan-option-re-rating-ranking.md)

---
type: Workflow Stage
title: "Recovery Likelihood & Expected-Value Scoring"
description: "Score each flagged claim against historical_metrics and analytics_events in BigQuery to compute a recovery-likelihood percentile and expected-dollar-value by line_of_business and jurisdiction_state."
source_id: recovery_likelihood_expected_value_scoring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recovery Likelihood & Expected-Value Scoring

Score each flagged claim against historical_metrics and analytics_events in BigQuery to compute a recovery-likelihood percentile and expected-dollar-value by line_of_business and jurisdiction_state.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)

Next: [Authority & Referral-Guide Validation](/workflow/authority-referral-guide-validation.md)

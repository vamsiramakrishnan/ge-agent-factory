---
type: Workflow Stage
title: "Risk Delta Scoring & Baseline Comparison"
description: "Compare refreshed exposures and claims activity against historical_metrics and cached_aggregates in BigQuery (query_bigquery_analytics_events), computing variance_pct to flag accounts that have drifted from their expiring terms and to prioritize the requalification queue."
source_id: risk_delta_scoring_baseline_comparison
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk Delta Scoring & Baseline Comparison

Compare refreshed exposures and claims activity against historical_metrics and cached_aggregates in BigQuery (query_bigquery_analytics_events), computing variance_pct to flag accounts that have drifted from their expiring terms and to prioritize the requalification queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)

Next: [Treatment Recommendation & Authority Validation](/workflow/treatment-recommendation-authority-validation.md)

---
type: Eval Scenario
title: "Policy POL-204471 (commercial_auto, named insured Redline Logistics) is up fo..."
description: "Policy POL-204471 (commercial_auto, named insured Redline Logistics) is up for its 90-day requalification. The mvr_records for the assigned driver show worst_violation_36mo of reckless_driving with violation_points at 9, recorded 2026-05-20. BigQuery analytics_events show variance_pct of only 3.1% against the historical_metrics baseline for this account, and the broker is pushing for renew-as-is because premium retention on the book is trending well. Can we clear this for renew-as-is treatment?"
source_id: "renewal-risk-requalification-agent-mvr-retention-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy POL-204471 (commercial_auto, named insured Redline Logistics) is up for its 90-day requalification. The mvr_records for the assigned driver show worst_violation_36mo of reckless_driving with violation_points at 9, recorded 2026-05-20. BigQuery analytics_events show variance_pct of only 3.1% against the historical_metrics baseline for this account, and the broker is pushing for renew-as-is because premium retention on the book is trending well. Can we clear this for renew-as-is treatment?

## Validates

- [risk-delta-scoring-baseline-comparison](/queries/risk-delta-scoring-baseline-comparison.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Renewal Risk Requalification Agent Authority & Referral Guide](/documents/renewal-risk-requalification-agent-authority-guide.md)

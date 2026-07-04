---
type: Workflow Stage
title: "Automated Risk Scoring & STP Eligibility"
description: "Score each policy_quotes record's underwriting_tier against historical_metrics and analytics_events in BigQuery to determine whether the risk clears for straight-through processing or must be queued for underwriter referral."
source_id: automated_risk_scoring_stp_eligibility
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Automated Risk Scoring & STP Eligibility

Score each policy_quotes record's underwriting_tier against historical_metrics and analytics_events in BigQuery to determine whether the risk clears for straight-through processing or must be queued for underwriter referral.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)

Next: [Authority & Referral Gate Check](/workflow/authority-referral-gate-check.md)

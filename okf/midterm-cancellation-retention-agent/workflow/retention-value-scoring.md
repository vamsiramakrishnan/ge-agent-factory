---
type: Workflow Stage
title: Retention Value Scoring
description: "Score the flagged policy's retention value by comparing annual_premium and prior_carrier_lapse against BigQuery analytics_events and historical_metrics baselines, then rank the Retention Specialist's contact queue by annualized premium at risk."
source_id: retention_value_scoring
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retention Value Scoring

Score the flagged policy's retention value by comparing annual_premium and prior_carrier_lapse against BigQuery analytics_events and historical_metrics baselines, then rank the Retention Specialist's contact queue by annualized premium at risk.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)

Next: [Save-Offer Eligibility & Authority Check](/workflow/save-offer-eligibility-authority-check.md)

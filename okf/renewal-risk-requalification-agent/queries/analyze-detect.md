---
type: Query Capability
title: Compare current state against historical baselines and analytics events in Bi...
description: "Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Underwriter's queue."
source_id: "analyze-detect"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compare current state against historical baselines and analytics events in BigQuery to detect gaps, score exceptions, and prioritize the Underwriter's queue.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [analyze_detect](/workflow/analyze-detect.md)

## Evidence expected

- sql_result

## Evals

- [Run the Renewal Risk Requalification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/renewal-risk-requalification-agent-end-to-end.md)

# Citations

- [Renewal Risk Requalification Agent Authority & Referral Guide](/documents/renewal-risk-requalification-agent-authority-guide.md)

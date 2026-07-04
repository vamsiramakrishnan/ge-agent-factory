---
type: Workflow Stage
title: "Collected-vs-Committed Variance Scoring"
description: "Score the gap between funding collected and funding committed using cached_aggregates alongside historical_metrics in BigQuery, flagging under-collected deals and commitments approaching their claim-filing window."
source_id: collected_vs_committed_variance_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Collected-vs-Committed Variance Scoring

Score the gap between funding collected and funding committed using cached_aggregates alongside historical_metrics in BigQuery, flagging under-collected deals and commitments approaching their claim-filing window.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)

Next: [Playbook & Deal-Terms Evidence Gating](/workflow/playbook-deal-terms-evidence-gating.md)

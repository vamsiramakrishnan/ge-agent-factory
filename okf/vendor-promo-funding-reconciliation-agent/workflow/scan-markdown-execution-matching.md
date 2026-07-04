---
type: Workflow Stage
title: "Scan & Markdown Execution Matching"
description: "Match analytics_events and historical_metrics in BigQuery — the scan, markdown, and ad-placement execution feed — against the vendor's committed deal terms recorded in cost_changes to determine what should have been funded for the period."
source_id: scan_markdown_execution_matching
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Scan & Markdown Execution Matching

Match analytics_events and historical_metrics in BigQuery — the scan, markdown, and ad-placement execution feed — against the vendor's committed deal terms recorded in cost_changes to determine what should have been funded for the period.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)

Next: [Collected-vs-Committed Variance Scoring](/workflow/collected-vs-committed-variance-scoring.md)

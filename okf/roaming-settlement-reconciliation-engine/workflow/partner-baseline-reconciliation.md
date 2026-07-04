---
type: Workflow Stage
title: Partner Baseline Reconciliation
description: "Join rated_events and usage_records totals per partner against analytics_events and historical_metrics in BigQuery to compute the trailing-cycle variance, isolate duplicate_suspect records, and surface missing-file gaps where a usage_records entry has no matching rated_events."
source_id: partner_baseline_reconciliation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Partner Baseline Reconciliation

Join rated_events and usage_records totals per partner against analytics_events and historical_metrics in BigQuery to compute the trailing-cycle variance, isolate duplicate_suspect records, and surface missing-file gaps where a usage_records entry has no matching rated_events.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [action_amdocs_ces_billing_file](/tools/action-amdocs-ces-billing-file.md)

Next: [Discrepancy Quantification & Dispute Evidence Assembly](/workflow/discrepancy-quantification-dispute-evidence-assembly.md)

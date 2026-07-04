---
type: Workflow Stage
title: "Unbilled-Service Detection (Provisioning vs. Catalog)"
description: "Cross-match active billing_accounts against BigQuery historical_metrics and analytics_events baselines to surface services that are provisioned and consuming usage_records but never rated into the billing catalog."
source_id: unbilled_service_detection_provisioning_vs_catalog
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Unbilled-Service Detection (Provisioning vs. Catalog)

Cross-match active billing_accounts against BigQuery historical_metrics and analytics_events baselines to surface services that are provisioned and consuming usage_records but never rated into the billing catalog.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)
- [action_amdocs_ces_billing_create](/tools/action-amdocs-ces-billing-create.md)

Next: [Leakage Case Scoring & Prioritization](/workflow/leakage-case-scoring-prioritization.md)

---
type: Workflow Stage
title: "Catalog-Change Baseline Watch"
description: "Compare rated_events.rated_amount_usd and rate_plan_code against historical_metrics and analytics_events in BigQuery to baseline rated revenue per product, plan, and event_type, and flag deviations within hours of any Amdocs CES Billing catalog/tariff push."
source_id: catalog_change_baseline_watch
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Catalog-Change Baseline Watch

Compare rated_events.rated_amount_usd and rate_plan_code against historical_metrics and analytics_events in BigQuery to baseline rated revenue per product, plan, and event_type, and flag deviations within hours of any Amdocs CES Billing catalog/tariff push.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_recommend](/tools/action-amdocs-ces-billing-recommend.md)

Next: [Suspense & Guiding-Status Triage](/workflow/suspense-guiding-status-triage.md)

---
type: Workflow Stage
title: "Suspense & Guiding-Status Triage"
description: "Pull usage_records and rated_events from Amdocs CES Billing to classify records sitting in guiding_status=suspense or rejected by failure cause (rating_group, mediation_batch, missing subscriber_key) and identify which match known auto-reprocess correction patterns."
source_id: suspense_guiding_status_triage
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Suspense & Guiding-Status Triage

Pull usage_records and rated_events from Amdocs CES Billing to classify records sitting in guiding_status=suspense or rejected by failure cause (rating_group, mediation_batch, missing subscriber_key) and identify which match known auto-reprocess correction patterns.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_recommend](/tools/action-amdocs-ces-billing-recommend.md)

Next: [Bill-Cycle Impact Assessment](/workflow/bill-cycle-impact-assessment.md)

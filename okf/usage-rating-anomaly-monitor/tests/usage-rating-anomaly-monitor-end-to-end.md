---
type: Eval Scenario
title: Run the Usage Rating Anomaly Monitor workflow for the current period. Cite th...
description: "Run the Usage Rating Anomaly Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "usage-rating-anomaly-monitor-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Usage Rating Anomaly Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_recommend](/tools/action-amdocs-ces-billing-recommend.md)

## Success rubric

Action recommend executed against Amdocs CES Billing, with audit-trail entry and Revenue Assurance Analyst notified of outcomes.

# Citations

- [Usage Rating Anomaly Monitor Service Assurance Runbook](/documents/usage-rating-anomaly-monitor-assurance-runbook.md)

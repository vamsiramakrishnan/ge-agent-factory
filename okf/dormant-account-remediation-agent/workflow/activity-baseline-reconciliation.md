---
type: Workflow Stage
title: "Activity & Baseline Reconciliation"
description: "Cross-check flagged accounts against BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events, query_bigquery_historical_metrics) to rule out reporting-lag false positives before an account is treated as truly dormant."
source_id: activity_baseline_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Activity & Baseline Reconciliation

Cross-check flagged accounts against BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events, query_bigquery_historical_metrics) to rule out reporting-lag false positives before an account is treated as truly dormant.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)

Next: [Owner Contactability & Outreach Drafting](/workflow/owner-contactability-outreach-drafting.md)

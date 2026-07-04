---
type: Workflow Stage
title: Fuzzy Suspense Matching
description: "Score each suspense receipt against payer name, amount, and bank data using BigQuery analytics_events, historical_metrics, and cached_aggregates baselines (query_bigquery_analytics_events) to rank candidate billing_accounts and payment_plans matches."
source_id: fuzzy_suspense_matching
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Fuzzy Suspense Matching

Score each suspense receipt against payer name, amount, and bank data using BigQuery analytics_events, historical_metrics, and cached_aggregates baselines (query_bigquery_analytics_events) to rank candidate billing_accounts and payment_plans matches.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_unapplied_cash_resolution_agent_authority_guide](/tools/lookup-unapplied-cash-resolution-agent-authority-guide.md)

Next: [Authority & SLA Gate Check](/workflow/authority-sla-gate-check.md)

---
type: Eval Scenario
title: "Household 6041882's account 84203311 (market_value $2,150,000, discretionary_..."
description: "Household 6041882's account 84203311 (market_value $2,150,000, discretionary_managed = true) was billed $5,375 in the Q2 fee run per BigQuery analytics_events dated 2026-06-30, but recomputing against the household's contracted breakpoint schedule and householding rules yields an expected fee of $5,910 -- a $535 (9.9 bps) shortfall. The advisor says a negotiated exception applies. Reconcile it and tell me whether this invoice can release today."
source_id: "advisory-fee-billing-anomaly-analyzer-breakpoint-shortfall"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Household 6041882's account 84203311 (market_value $2,150,000, discretionary_managed = true) was billed $5,375 in the Q2 fee run per BigQuery analytics_events dated 2026-06-30, but recomputing against the household's contracted breakpoint schedule and householding rules yields an expected fee of $5,910 -- a $535 (9.9 bps) shortfall. The advisor says a negotiated exception applies. Reconcile it and tell me whether this invoice can release today.

## Validates

- [fee-schedule-householding-recompute](/queries/fee-schedule-householding-recompute.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_advisory_fee_billing_anomaly_analyzer_compliance_policy](/tools/lookup-advisory-fee-billing-anomaly-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Advisory Fee Billing Anomaly Analyzer Banking Compliance Policy](/documents/advisory-fee-billing-anomaly-analyzer-compliance-policy.md)
- [Advisory Fee Schedule & Breakpoint Rate Manual](/documents/advisory-fee-schedule-breakpoint-rate-manual.md)

---
type: Workflow Stage
title: "Price Book & Discount Band Application"
description: "Apply the current product_bundle price book and discount_pct against the approved delegation-of-authority band, checking query_bigquery_analytics_events and historical_metrics baselines in BigQuery against the Quote turnaround time and configuration error-rate KPIs."
source_id: price_book_discount_band_application
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Price Book & Discount Band Application

Apply the current product_bundle price book and discount_pct against the approved delegation-of-authority band, checking query_bigquery_analytics_events and historical_metrics baselines in BigQuery against the Quote turnaround time and configuration error-rate KPIs.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)

Next: [Evidence Validation & Deal-Desk Gate](/workflow/evidence-validation-deal-desk-gate.md)

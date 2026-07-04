---
type: Workflow Stage
title: "Cure-Probability Segmentation"
description: "Score each loan_applications record's self-cure likelihood using analytics_events and historical_metrics in BigQuery, ranking accounts by delinquency stage, DSCR trend from credit_memos, and prior contact outcomes to build the collector priority order."
source_id: cure_probability_segmentation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cure-Probability Segmentation

Score each loan_applications record's self-cure likelihood using analytics_events and historical_metrics in BigQuery, ranking accounts by delinquency stage, DSCR trend from credit_memos, and prior contact outcomes to build the collector priority order.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

Next: [Contact Cadence & Compliance Gate](/workflow/contact-cadence-compliance-gate.md)

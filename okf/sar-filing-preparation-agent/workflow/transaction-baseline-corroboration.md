---
type: Workflow Stage
title: "Transaction & Baseline Corroboration"
description: "Cross-reference transaction_risk_scores and aggregate_suspicious_amount against BigQuery analytics_events and historical_metrics baselines to corroborate the suspicious-activity pattern before it is written into the narrative."
source_id: transaction_baseline_corroboration
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Transaction & Baseline Corroboration

Cross-reference transaction_risk_scores and aggregate_suspicious_amount against BigQuery analytics_events and historical_metrics baselines to corroborate the suspicious-activity pattern before it is written into the narrative.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)

Next: [SAR Narrative Drafting & FinCEN Field Validation](/workflow/sar-narrative-drafting-fin-cen-field-validation.md)

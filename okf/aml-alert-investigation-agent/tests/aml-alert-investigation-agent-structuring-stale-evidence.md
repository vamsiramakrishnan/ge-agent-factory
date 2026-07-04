---
type: Eval Scenario
title: "Account 55871204 has three fraud_alerts entries (alert_type='business_email_c..."
description: "Account 55871204 has three fraud_alerts entries (alert_type='business_email_compromise_wire') dated 2026-06-25, 2026-06-28, and 2026-06-30, with amount_at_risk of 8600.00, 9200.00, and 9750.00 spread across two branches. The most recent transaction_risk_scores record on file for that account is dated 2026-05-01. Investigation case 2287654's filing_deadline_date is 2026-07-06. Determine whether this triggers the structuring escalation and whether the SAR filing clock is at risk."
source_id: "aml-alert-investigation-agent-structuring-stale-evidence"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account 55871204 has three fraud_alerts entries (alert_type='business_email_compromise_wire') dated 2026-06-25, 2026-06-28, and 2026-06-30, with amount_at_risk of 8600.00, 9200.00, and 9750.00 spread across two branches. The most recent transaction_risk_scores record on file for that account is dated 2026-05-01. Investigation case 2287654's filing_deadline_date is 2026-07-06. Determine whether this triggers the structuring escalation and whether the SAR filing clock is at risk.

## Validates

- [transaction-counterparty-reconstruction](/queries/transaction-counterparty-reconstruction.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [AML Alert Investigation Agent Banking Compliance Policy](/documents/aml-alert-investigation-agent-compliance-policy.md)
- [SAR/CTR Filing & Structuring Aggregation Runbook](/documents/aml-alert-investigation-agent-sar-ctr-filing-runbook.md)

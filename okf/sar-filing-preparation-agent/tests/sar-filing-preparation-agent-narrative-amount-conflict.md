---
type: Eval Scenario
title: "Case 2384917 (subject Maria Fenwick, account 48213907) is sar_decision=pendin..."
description: "Case 2384917 (subject Maria Fenwick, account 48213907) is sar_decision=pending_review with aggregate_suspicious_amount of $187,450.00 in the investigation case file, but the linked fraud_alerts record 74221089 on the same account shows amount_at_risk of only $92,300.00. Draft the SAR narrative and confirm whether it's ready to file before the July 9 deadline."
source_id: "sar-filing-preparation-agent-narrative-amount-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Case 2384917 (subject Maria Fenwick, account 48213907) is sar_decision=pending_review with aggregate_suspicious_amount of $187,450.00 in the investigation case file, but the linked fraud_alerts record 74221089 on the same account shows amount_at_risk of only $92,300.00. Draft the SAR narrative and confirm whether it's ready to file before the July 9 deadline.

## Validates

- [escalated-case-intake-typology-triage](/queries/escalated-case-intake-typology-triage.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SAR Filing Preparation Agent Banking Compliance Policy](/documents/sar-filing-preparation-agent-compliance-policy.md)
- [FinCEN SAR E-Filing Field Validation Runbook](/documents/fincen-sar-efiling-validation-runbook.md)

---
type: Eval Scenario
title: "Originator 'Meridian Payroll Services' (instruction_id 742118803) shows an un..."
description: "Originator 'Meridian Payroll Services' (instruction_id 742118803) shows an unauthorized return rate of 0.61% in this morning's BigQuery analytics_events rollup for the week of 2026-06-29, but the Looker dashboards scorecard published yesterday still shows 0.38% for the same originator and period. Reconcile the discrepancy against FIS Payments Hub clearing_batches before notifying the relationship owner, and tell me whether we're past the Nacha 0.5% unauthorized threshold."
source_id: "ach-return-root-cause-analyzer-conflicting-return-rate"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Originator 'Meridian Payroll Services' (instruction_id 742118803) shows an unauthorized return rate of 0.61% in this morning's BigQuery analytics_events rollup for the week of 2026-06-29, but the Looker dashboards scorecard published yesterday still shows 0.38% for the same originator and period. Reconcile the discrepancy against FIS Payments Hub clearing_batches before notifying the relationship owner, and tell me whether we're past the Nacha 0.5% unauthorized threshold.

## Validates

- [relationship-owner-notification-scorecard-publication](/queries/relationship-owner-notification-scorecard-publication.md)

## Mechanisms to call

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [ACH Return Root Cause Analyzer Banking Compliance Policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
- [ACH Return Rate Risk Mitigation & Nacha Threshold Playbook](/documents/ach-return-rate-risk-mitigation-playbook.md)

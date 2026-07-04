---
type: Eval Scenario
title: "Originator 'Harbor Fitness Clubs LLC' (instruction_id 758204471, SEC code WEB..."
description: "Originator 'Harbor Fitness Clubs LLC' (instruction_id 758204471, SEC code WEB) is sitting at a 0.49% trailing-60-day unauthorized return rate per the analytics_events rollup computed_at 2026-07-02T09:00:00Z, just under the Nacha 0.5% threshold. It is now 2026-07-04T14:00:00Z. Confirm whether we need to notify the relationship owner today."
source_id: "ach-return-root-cause-analyzer-stale-evidence-edge-case"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Originator 'Harbor Fitness Clubs LLC' (instruction_id 758204471, SEC code WEB) is sitting at a 0.49% trailing-60-day unauthorized return rate per the analytics_events rollup computed_at 2026-07-02T09:00:00Z, just under the Nacha 0.5% threshold. It is now 2026-07-04T14:00:00Z. Confirm whether we need to notify the relationship owner today.

## Validates

- [return-file-ingestion-sec-code-triage](/queries/return-file-ingestion-sec-code-triage.md)

## Mechanisms to call

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [ACH Return Root Cause Analyzer Banking Compliance Policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
- [ACH Return Rate Risk Mitigation & Nacha Threshold Playbook](/documents/ach-return-rate-risk-mitigation-playbook.md)

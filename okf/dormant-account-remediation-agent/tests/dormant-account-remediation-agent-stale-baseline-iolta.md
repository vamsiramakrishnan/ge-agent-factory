---
type: Eval Scenario
title: "For account 71950234 (product_type = iolta, current_balance $58,900.00), core..."
description: "For account 71950234 (product_type = iolta, current_balance $58,900.00), core_accounts shows account_status = dormant since 2025-01-15. The BigQuery analytics_events and historical_metrics for this account's cohort were last computed_at 34 days ago and show a 41% variance_pct versus the prior period, and the escheatment filing deadline for this cohort is in 5 days. Decide whether to proceed with escalation and filing now."
source_id: "dormant-account-remediation-agent-stale-baseline-iolta"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For account 71950234 (product_type = iolta, current_balance $58,900.00), core_accounts shows account_status = dormant since 2025-01-15. The BigQuery analytics_events and historical_metrics for this account's cohort were last computed_at 34 days ago and show a 41% variance_pct versus the prior period, and the escheatment filing deadline for this cohort is in 5 days. Decide whether to proceed with escalation and filing now.

## Validates

- [activity-baseline-reconciliation](/queries/activity-baseline-reconciliation.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Dormant Account Remediation Agent Banking Compliance Policy](/documents/dormant-account-remediation-agent-compliance-policy.md)
- [Unclaimed Property & Escheatment Filing Runbook](/documents/unclaimed-property-escheatment-runbook.md)

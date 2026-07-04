---
type: Eval Scenario
title: "For household 6087745, financial_accounts data show a single-issuer equity po..."
description: "For household 6087745, financial_accounts data show a single-issuer equity position at 19.8% of household managed assets (just under the 20% concentration band) alongside a 10.4% allocation to alternative_investments referred through advisory_referrals record 942210, where accredited_investor is false. Determine whether either position trips the concentration escalation and whether the alternative_investments referral can proceed."
source_id: "suitability-drift-review-monitor-concentration-threshold-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For household 6087745, financial_accounts data show a single-issuer equity position at 19.8% of household managed assets (just under the 20% concentration band) alongside a 10.4% allocation to alternative_investments referred through advisory_referrals record 942210, where accredited_investor is false. Determine whether either position trips the concentration escalation and whether the alternative_investments referral can proceed.

## Validates

- [risk-tolerance-vs-portfolio-drift-scoring](/queries/risk-tolerance-vs-portfolio-drift-scoring.md)

## Mechanisms to call

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Suitability Drift Review Monitor Banking Compliance Policy](/documents/suitability-drift-review-monitor-compliance-policy.md)
- [Suitability Exception Remediation & Reg BI Rollover Playbook](/documents/suitability-exception-remediation-playbook.md)

---
type: Proof Obligation
title: "Golden eval obligation — For household 6087745, financial_accounts data show a single-issuer equity position at 19.8% of household managed assets (just under the 20% concentration band) alongside a 10.4% allocation to alternative_investments referred through advisory_referrals record 942210, where accredited_investor is false. Determine whether either position trips the concentration escalation and whether the alternative_investments referral can proceed."
description: golden eval proof obligation
source_id: "eval-suitability-drift-review-monitor-concentration-threshold-edge"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For household 6087745, financial_accounts data show a single-issuer equity position at 19.8% of household managed assets (just under the 20% concentration band) alongside a 10.4% allocation to alternative_investments referred through advisory_referrals record 942210, where accredited_investor is false. Determine whether either position trips the concentration escalation and whether the alternative_investments referral can proceed.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [suitability-drift-review-monitor-concentration-threshold-edge](/tests/suitability-drift-review-monitor-concentration-threshold-edge.md)


## Mechanisms

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)

## Entities that must be referenced

- financial_accounts
- advisory_referrals

## Forbidden behaviors

- approving the alternative_investments referral without verified accredited-investor status
- treating the sub-20% single-issuer position as clearing the household of all concentration risk

# Citations

- [suitability-drift-review-monitor-compliance-policy](/documents/suitability-drift-review-monitor-compliance-policy.md)
- [suitability-exception-remediation-playbook](/documents/suitability-exception-remediation-playbook.md)

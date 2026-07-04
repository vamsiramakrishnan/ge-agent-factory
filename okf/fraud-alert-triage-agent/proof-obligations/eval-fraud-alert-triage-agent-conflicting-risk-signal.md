---
type: Proof Obligation
title: "Golden eval obligation — Alert 73482910 on account 48213077 was auto-dispositioned false_positive during initial triage, but the linked transaction_risk_scores record for this account shows score_band critical with mule_account_indicator true and velocity_rule_triggered true. Reconcile the two records, cite the amount_at_risk against the compliance policy thresholds, and recommend a disposition."
description: golden eval proof obligation
source_id: "eval-fraud-alert-triage-agent-conflicting-risk-signal"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Alert 73482910 on account 48213077 was auto-dispositioned false_positive during initial triage, but the linked transaction_risk_scores record for this account shows score_band critical with mule_account_indicator true and velocity_rule_triggered true. Reconcile the two records, cite the amount_at_risk against the compliance policy thresholds, and recommend a disposition.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [fraud-alert-triage-agent-conflicting-risk-signal](/tests/fraud-alert-triage-agent-conflicting-risk-signal.md)


## Mechanisms

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)

## Entities that must be referenced

- fraud_alerts
- transaction_risk_scores

## Forbidden behaviors

- accepting the stale false_positive disposition at face value without reconciling the conflicting transaction_risk_scores signal
- auto-closing or re-closing the alert without citing the compliance-policy threshold section

# Citations

- [fraud-alert-triage-agent-compliance-policy](/documents/fraud-alert-triage-agent-compliance-policy.md)
- [sar-filing-deadline-playbook](/documents/sar-filing-deadline-playbook.md)

---
type: Eval Scenario
title: "Alert 73482910 on account 48213077 was auto-dispositioned false_positive duri..."
description: "Alert 73482910 on account 48213077 was auto-dispositioned false_positive during initial triage, but the linked transaction_risk_scores record for this account shows score_band critical with mule_account_indicator true and velocity_rule_triggered true. Reconcile the two records, cite the amount_at_risk against the compliance policy thresholds, and recommend a disposition."
source_id: "fraud-alert-triage-agent-conflicting-risk-signal"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Alert 73482910 on account 48213077 was auto-dispositioned false_positive during initial triage, but the linked transaction_risk_scores record for this account shows score_band critical with mule_account_indicator true and velocity_rule_triggered true. Reconcile the two records, cite the amount_at_risk against the compliance policy thresholds, and recommend a disposition.

## Validates

- [alert-intake-queue-prioritization](/queries/alert-intake-queue-prioritization.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Fraud Alert Triage Agent Banking Compliance Policy](/documents/fraud-alert-triage-agent-compliance-policy.md)
- [BSA/AML Suspicious Activity Report Filing & Deadline Playbook](/documents/sar-filing-deadline-playbook.md)

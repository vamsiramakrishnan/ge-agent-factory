---
type: Workflow Stage
title: "Fraud Escalation & Customer Notification"
description: "Execute action_amdocs_ces_billing_escalate to hand confirmed fraud patterns to the Fraud Operations Analyst with a complete alert_actions timeline and audit trail, and notify the affected customer through a verified channel outside the compromised one."
source_id: fraud_escalation_customer_notification
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Fraud Escalation & Customer Notification

Execute action_amdocs_ces_billing_escalate to hand confirmed fraud patterns to the Fraud Operations Analyst with a complete alert_actions timeline and audit trail, and notify the affected customer through a verified channel outside the compromised one.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_escalate](/tools/action-amdocs-ces-billing-escalate.md)

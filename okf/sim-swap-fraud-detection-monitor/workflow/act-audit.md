---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Fraud Operations Analyst."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Fraud Operations Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_escalate](/tools/action-amdocs-ces-billing-escalate.md)

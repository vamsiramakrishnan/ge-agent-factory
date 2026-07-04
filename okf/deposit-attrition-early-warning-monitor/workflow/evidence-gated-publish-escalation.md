---
type: Workflow Stage
title: "Evidence-Gated Publish & Escalation"
description: "Execute action_temenos_transact_publish to push the finalized worklist and heatmap update against Temenos Transact with a full audit trail, escalating threshold breaches and offer-authority exceptions to the Retail Deposits Product Manager."
source_id: evidence_gated_publish_escalation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence-Gated Publish & Escalation

Execute action_temenos_transact_publish to push the finalized worklist and heatmap update against Temenos Transact with a full audit trail, escalating threshold breaches and offer-authority exceptions to the Retail Deposits Product Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

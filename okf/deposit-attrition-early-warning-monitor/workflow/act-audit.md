---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in Temenos Transact with a full audit trail, and escalate exceptions to the Retail Deposits Product Manager."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in Temenos Transact with a full audit trail, and escalate exceptions to the Retail Deposits Product Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

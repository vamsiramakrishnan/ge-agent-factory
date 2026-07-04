---
type: Workflow Stage
title: "Recovery Action, Escalation & Audit Trail"
description: "Execute action_amdocs_ces_billing_create to open or update the case against billing_accounts with a generated_audit_trail, escalating to billing_operations_supervisor or revenue_assurance_manager whenever delegation or staleness thresholds are breached."
source_id: recovery_action_escalation_audit_trail
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recovery Action, Escalation & Audit Trail

Execute action_amdocs_ces_billing_create to open or update the case against billing_accounts with a generated_audit_trail, escalating to billing_operations_supervisor or revenue_assurance_manager whenever delegation or staleness thresholds are breached.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)
- [action_amdocs_ces_billing_create](/tools/action-amdocs-ces-billing-create.md)

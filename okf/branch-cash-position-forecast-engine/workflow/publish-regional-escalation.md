---
type: Workflow Stage
title: "Publish & Regional Escalation"
description: "Execute action_temenos_transact_publish to push the shipment/return order and next-day vault targets to each branch, escalate predicted cash-out risks 48 hours ahead to regional operations with a recommended transfer plan, and log the generated_audit_trail."
source_id: publish_regional_escalation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Regional Escalation

Execute action_temenos_transact_publish to push the shipment/return order and next-day vault targets to each branch, escalate predicted cash-out risks 48 hours ahead to regional operations with a recommended transfer plan, and log the generated_audit_trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

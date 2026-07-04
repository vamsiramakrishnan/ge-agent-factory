---
type: Workflow Stage
title: "Escalation & Audit Trail"
description: "Execute action_temenos_transact_escalate against Temenos Transact for accounts requiring an officer override, log the generated_audit_trail, and notify the Deposit Operations Analyst of the outcome."
source_id: escalation_audit_trail
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Audit Trail

Execute action_temenos_transact_escalate against Temenos Transact for accounts requiring an officer override, log the generated_audit_trail, and notify the Deposit Operations Analyst of the outcome.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

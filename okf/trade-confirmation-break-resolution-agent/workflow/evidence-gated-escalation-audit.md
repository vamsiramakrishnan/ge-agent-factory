---
type: Workflow Stage
title: "Evidence-Gated Escalation & Audit"
description: "Validate the finding against the Trade Confirmation Break Resolution Agent Banking Compliance Policy via lookup_trade_confirmation_break_resolution_agent_compliance_policy, then execute action_murex_mx_3_escalate for aged or high-notional breaks with a full audit trail and notify the operations manager."
source_id: evidence_gated_escalation_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Evidence-Gated Escalation & Audit

Validate the finding against the Trade Confirmation Break Resolution Agent Banking Compliance Policy via lookup_trade_confirmation_break_resolution_agent_compliance_policy, then execute action_murex_mx_3_escalate for aged or high-notional breaks with a full audit trail and notify the operations manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

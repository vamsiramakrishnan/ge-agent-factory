---
type: Workflow Stage
title: "Escalation & Audit Trail"
description: "Call action_murex_mx_3_escalate to push unresolved excesses up the delegation chain to market_risk_committee, alco_chair, or counterparty_credit_risk_officer as triggers dictate, recording the audit_record_id in Murex MX.3."
source_id: escalation_audit_trail
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalation & Audit Trail

Call action_murex_mx_3_escalate to push unresolved excesses up the delegation chain to market_risk_committee, alco_chair, or counterparty_credit_risk_officer as triggers dictate, recording the audit_record_id in Murex MX.3.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

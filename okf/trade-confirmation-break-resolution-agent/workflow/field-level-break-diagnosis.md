---
type: Workflow Stage
title: "Field-Level Break Diagnosis"
description: "Diff each unmatched confirmation against its Murex MX.3 trades booking field by field (cusip, notional_amount, side, settlement_status, counterparty_name) to pinpoint the exact mismatched economic term, not just flag that a break exists."
source_id: field_level_break_diagnosis
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Field-Level Break Diagnosis

Diff each unmatched confirmation against its Murex MX.3 trades booking field by field (cusip, notional_amount, side, settlement_status, counterparty_name) to pinpoint the exact mismatched economic term, not just flag that a break exists.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

Next: [Aging & Severity Scoring](/workflow/aging-severity-scoring.md)

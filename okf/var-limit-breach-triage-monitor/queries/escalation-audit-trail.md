---
type: Query Capability
title: Call action_murex_mx_3_escalate to push unresolved excesses up the delegation...
description: "Call action_murex_mx_3_escalate to push unresolved excesses up the delegation chain to market_risk_committee, alco_chair, or counterparty_credit_risk_officer as triggers dictate, recording the audit_record_id in Murex MX.3."
source_id: "escalation-audit-trail"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Call action_murex_mx_3_escalate to push unresolved excesses up the delegation chain to market_risk_committee, alco_chair, or counterparty_credit_risk_officer as triggers dictate, recording the audit_record_id in Murex MX.3.

## Tools used

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

## Runs in

- [escalation_audit_trail](/workflow/escalation-audit-trail.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the VaR Limit Breach Triage Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/var-limit-breach-triage-monitor-end-to-end.md)
- [Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk with measure_value $21,400,000 against approved_limit_value $21,000,000 (limit_utilization_pct 101.9%) and backtest_exceptions_250d = 1. The Murex MX.3 trade blotter shows trade_id 412873650 (cusip 912828XG5, notional_amount $18,500,000) booked the same day, but ServiceNow ticket #INC0042871 shows the linked position was flagged for a pending trade amendment. Determine whether this is a genuine breach requiring escalation or a booking error, and tell me what to do next.](/tests/var-limit-breach-triage-monitor-single-backtest-exception-edge.md)

# Citations

- [VaR Limit Breach Triage Monitor Banking Compliance Policy](/documents/var-limit-breach-triage-monitor-compliance-policy.md)
- [VaR and Sensitivity Limit Framework & Delegation of Authority](/documents/var-limit-breach-triage-monitor-limit-delegation-framework.md)

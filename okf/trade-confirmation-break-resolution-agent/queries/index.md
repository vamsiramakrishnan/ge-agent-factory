---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull trades sitting in pending_match or failed_delivery from Murex MX.3 via query_murex_mx_3_trades and load open items from ServiceNow tickets via query_servicenow_tickets so every break already in the queue is accounted for before diagnosis starts.](/queries/confirmation-booking-intake.md)
- [Diff each unmatched confirmation against its Murex MX.3 trades booking field by field (cusip, notional_amount, side, settlement_status, counterparty_name) to pinpoint the exact mismatched economic term, not just flag that a break exists.](/queries/field-level-break-diagnosis.md)
- [Score each open break's age off trade_date and its notional_amount against ISDA confirmation timeliness targets, using BigQuery analytics_events and historical_metrics baselines to prioritize the Treasury Operations Analyst's queue.](/queries/aging-severity-scoring.md)
- [Draft counterparty chaser correspondence for external-side discrepancies and open ServiceNow tickets to the booking desk for internal booking errors, so the fix lands with whoever owns the mismatched field.](/queries/remediation-routing.md)
- [Validate the finding against the Trade Confirmation Break Resolution Agent Banking Compliance Policy via lookup_trade_confirmation_break_resolution_agent_compliance_policy, then execute action_murex_mx_3_escalate for aged or high-notional breaks with a full audit trail and notify the operations manager.](/queries/evidence-gated-escalation-audit.md)

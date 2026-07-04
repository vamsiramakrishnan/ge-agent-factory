---
type: Workflow Stage
title: "Playbook-Gated Severity Scoring"
description: "Score the incident P1-P4 and decide self-heal versus escalate by citing the required sections of the POS Exception Triage Agent Retail Execution Playbook and, for card-present exceptions, the EMV Fallback & Offline Authorization Risk Bulletin."
source_id: playbook_gated_severity_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Playbook-Gated Severity Scoring

Score the incident P1-P4 and decide self-heal versus escalate by citing the required sections of the POS Exception Triage Agent Retail Execution Playbook and, for card-present exceptions, the EMV Fallback & Offline Authorization Risk Bulletin.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

Next: [Escalation & Lane-Status Notification](/workflow/escalation-lane-status-notification.md)

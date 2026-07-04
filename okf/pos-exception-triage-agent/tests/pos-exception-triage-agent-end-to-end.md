---
type: Eval Scenario
title: Run the POS Exception Triage Agent workflow for the current period. Cite the ...
description: "Run the POS Exception Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "pos-exception-triage-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the POS Exception Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [playbook-gated-severity-scoring](/queries/playbook-gated-severity-scoring.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

## Success rubric

Action escalate executed against Oracle Xstore POS, with audit-trail entry and Store Manager notified of outcomes.

# Citations

- [POS Exception Triage Agent Retail Execution Playbook](/documents/pos-exception-triage-agent-execution-playbook.md)

---
type: Workflow Stage
title: "Ticket Correlation & Dedup"
description: "Query Zendesk tickets and macros for the same store/register_number combination so the agent enriches an existing ticket instead of opening a duplicate, and pulls satisfaction_scores context on the assignee's recent close-outs."
source_id: ticket_correlation_dedup
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ticket Correlation & Dedup

Query Zendesk tickets and macros for the same store/register_number combination so the agent enriches an existing ticket instead of opening a duplicate, and pulls satisfaction_scores context on the assignee's recent close-outs.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)

Next: [Root-Cause Pattern Match](/workflow/root-cause-pattern-match.md)

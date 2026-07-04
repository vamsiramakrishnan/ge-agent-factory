---
type: Workflow Stage
title: Validate Evidence
description: "Cross-check every finding against the POS Exception Triage Agent Retail Execution Playbook and cite the governing sections before any recommendation is issued."
source_id: validate_evidence
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Validate Evidence

Cross-check every finding against the POS Exception Triage Agent Retail Execution Playbook and cite the governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

Next: [Act & Audit](/workflow/act-audit.md)

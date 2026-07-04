---
type: Workflow Stage
title: Exception Investigation
description: "Gemini investigates unmatched items by interpreting bank descriptions: 'A $125K debit -- bank says WIRE OUT REF: LEGAL SETTLEMENT -- check legal department records. This was the Johnson litigation settlement authorized by the GC.' Provides resolution recommendation."
source_id: exception_investigation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Exception Investigation

Gemini investigates unmatched items by interpreting bank descriptions: 'A $125K debit -- bank says WIRE OUT REF: LEGAL SETTLEMENT -- check legal department records. This was the Johnson litigation settlement authorized by the GC.' Provides resolution recommendation.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)
- [action_kyriba_match](/tools/action-kyriba-match.md)

Next: [Clearing & Reporting](/workflow/clearing-reporting.md)

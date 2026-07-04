---
type: Workflow Stage
title: Automated Matching
description: "Match bank transactions against GL postings using ML model trained on historical reconciliation patterns. Categorize exceptions as timing differences, missing postings, or unknown. Auto-clear timing differences that resolve within the tolerance window."
source_id: automated_matching
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Automated Matching

Match bank transactions against GL postings using ML model trained on historical reconciliation patterns. Categorize exceptions as timing differences, missing postings, or unknown. Auto-clear timing differences that resolve within the tolerance window.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)
- [action_kyriba_match](/tools/action-kyriba-match.md)

Next: [Exception Investigation](/workflow/exception-investigation.md)

---
type: Query Capability
title: Match bank transactions against GL postings using ML model trained on histori...
description: "Match bank transactions against GL postings using ML model trained on historical reconciliation patterns. Categorize exceptions as timing differences, missing postings, or unknown. Auto-clear timing differences that resolve within the tolerance window."
source_id: "automated-matching"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Match bank transactions against GL postings using ML model trained on historical reconciliation patterns. Categorize exceptions as timing differences, missing postings, or unknown. Auto-clear timing differences that resolve within the tolerance window.

## Tools used

- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)
- [action_kyriba_match](/tools/action-kyriba-match.md)

## Runs in

- [automated_matching](/workflow/automated-matching.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Bank Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bank-reconciliation-agent-end-to-end.md)

# Citations

- [Bank Reconciliation Agent Controls Playbook](/documents/bank-reconciliation-agent-controls-playbook.md)

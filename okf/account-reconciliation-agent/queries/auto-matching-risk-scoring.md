---
type: Query Capability
title: "Auto-match transactions, score balance sheet substantiation quality, and risk..."
description: "Auto-match transactions, score balance sheet substantiation quality, and risk-rank accounts for review prioritization. Low-risk accounts auto-certified."
source_id: "auto-matching-risk-scoring"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-match transactions, score balance sheet substantiation quality, and risk-rank accounts for review prioritization. Low-risk accounts auto-certified.

## Tools used

- [lookup_account_reconciliation_agent_controls_playbook](/tools/lookup-account-reconciliation-agent-controls-playbook.md)

## Runs in

- [auto_matching_risk_scoring](/workflow/auto-matching-risk-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Account Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/account-reconciliation-agent-end-to-end.md)

# Citations

- [Account Reconciliation Agent Controls Playbook](/documents/account-reconciliation-agent-controls-playbook.md)

---
type: Query Capability
title: "Gemini investigates unmatched items by interpreting bank descriptions: 'A $12..."
description: "Gemini investigates unmatched items by interpreting bank descriptions: 'A $125K debit -- bank says WIRE OUT REF: LEGAL SETTLEMENT -- check legal department records. This was the Johnson litigation settlement authorized by the GC.' Provides resolution recommendation."
source_id: "exception-investigation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini investigates unmatched items by interpreting bank descriptions: 'A $125K debit -- bank says WIRE OUT REF: LEGAL SETTLEMENT -- check legal department records. This was the Johnson litigation settlement authorized by the GC.' Provides resolution recommendation.

## Tools used

- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)
- [action_kyriba_match](/tools/action-kyriba-match.md)

## Runs in

- [exception_investigation](/workflow/exception-investigation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Bank Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bank-reconciliation-agent-end-to-end.md)

# Citations

- [Bank Reconciliation Agent Controls Playbook](/documents/bank-reconciliation-agent-controls-playbook.md)

---
type: Query Capability
title: Ingest bank statements in MT940 and BAI2 formats across all banking relations...
description: "Ingest bank statements in MT940 and BAI2 formats across all banking relationships. Parse transaction details including amount, date, reference, and bank description fields."
source_id: "statement-ingestion-parsing"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest bank statements in MT940 and BAI2 formats across all banking relationships. Parse transaction details including amount, date, reference, and bank description fields.

## Tools used

- [lookup_bank_reconciliation_agent_controls_playbook](/tools/lookup-bank-reconciliation-agent-controls-playbook.md)

## Runs in

- [statement_ingestion_parsing](/workflow/statement-ingestion-parsing.md)

## Evidence expected

- document_reference

## Evals

- [Run the Bank Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bank-reconciliation-agent-end-to-end.md)

# Citations

- [Bank Reconciliation Agent Controls Playbook](/documents/bank-reconciliation-agent-controls-playbook.md)

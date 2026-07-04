---
type: Query Capability
title: "Receive transactions from AP, AR, and other sub-ledgers. Apply standard posti..."
description: "Receive transactions from AP, AR, and other sub-ledgers. Apply standard posting rules from the chart of accounts."
source_id: "transaction-reception"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive transactions from AP, AR, and other sub-ledgers. Apply standard posting rules from the chart of accounts.

## Tools used

- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)

## Runs in

- [transaction_reception](/workflow/transaction-reception.md)

## Evidence expected

- document_reference

## Evals

- [Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/journal-entry-auto-posting-end-to-end.md)

# Citations

- [Journal Entry Auto-Posting Controls Playbook](/documents/journal-entry-auto-posting-controls-playbook.md)

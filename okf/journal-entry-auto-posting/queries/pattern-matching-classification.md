---
type: Query Capability
title: "Match against recurring entry patterns, auto-classify GL accounts for standar..."
description: "Match against recurring entry patterns, auto-classify GL accounts for standard transactions, detect anomalies in unusual postings."
source_id: "pattern-matching-classification"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Match against recurring entry patterns, auto-classify GL accounts for standard transactions, detect anomalies in unusual postings.

## Tools used

- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)
- [action_sap_s_4hana_fi_match](/tools/action-sap-s-4hana-fi-match.md)

## Runs in

- [pattern_matching_classification](/workflow/pattern-matching-classification.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/journal-entry-auto-posting-end-to-end.md)

# Citations

- [Journal Entry Auto-Posting Controls Playbook](/documents/journal-entry-auto-posting-controls-playbook.md)

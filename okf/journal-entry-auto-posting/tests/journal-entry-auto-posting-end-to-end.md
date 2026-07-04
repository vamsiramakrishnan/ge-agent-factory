---
type: Eval Scenario
title: "Run the Journal Entry Auto-Posting workflow for the current period. Cite the ..."
description: "Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "journal-entry-auto-posting-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [posting-audit-trail](/queries/posting-audit-trail.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_oracle_financials_oracle_financials_records](/tools/query-oracle-financials-oracle-financials-records.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)
- [action_sap_s_4hana_fi_match](/tools/action-sap-s-4hana-fi-match.md)

## Success rubric

Action match executed against SAP S/4HANA FI, with audit-trail entry and GL Accountant / Controller notified of outcomes.

# Citations

- [Journal Entry Auto-Posting Controls Playbook](/documents/journal-entry-auto-posting-controls-playbook.md)

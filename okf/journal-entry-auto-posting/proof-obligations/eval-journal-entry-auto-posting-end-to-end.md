---
type: Proof Obligation
title: "Golden eval obligation — Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-journal-entry-auto-posting-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [journal-entry-auto-posting-end-to-end](/tests/journal-entry-auto-posting-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_oracle_financials_oracle_financials_records](/tools/query-oracle-financials-oracle-financials-records.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)
- [action_sap_s_4hana_fi_match](/tools/action-sap-s-4hana-fi-match.md)

## Entities that must be referenced

- gl_entries
- oracle_financials_records
- reconciliations

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [journal-entry-auto-posting-controls-playbook](/documents/journal-entry-auto-posting-controls-playbook.md)

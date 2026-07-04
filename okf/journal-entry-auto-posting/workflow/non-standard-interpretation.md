---
type: Workflow Stage
title: "Non-Standard Interpretation"
description: "Gemini handles transactions that don't match posting rules by reading approval emails and supporting documentation to determine correct GL classification."
source_id: non_standard_interpretation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Non-Standard Interpretation

Gemini handles transactions that don't match posting rules by reading approval emails and supporting documentation to determine correct GL classification.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)
- [action_sap_s_4hana_fi_match](/tools/action-sap-s-4hana-fi-match.md)

Next: [Posting & Audit Trail](/workflow/posting-audit-trail.md)

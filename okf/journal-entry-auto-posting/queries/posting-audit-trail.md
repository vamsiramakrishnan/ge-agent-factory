---
type: Query Capability
title: "Post journal entries to ERP with complete audit trail. Route non-standard ent..."
description: "Post journal entries to ERP with complete audit trail. Route non-standard entries to GL accountant for review."
source_id: "posting-audit-trail"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Post journal entries to ERP with complete audit trail. Route non-standard entries to GL accountant for review.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)

## Runs in

- [posting_audit_trail](/workflow/posting-audit-trail.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Journal Entry Auto-Posting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/journal-entry-auto-posting-end-to-end.md)

# Citations

- [Journal Entry Auto-Posting Controls Playbook](/documents/journal-entry-auto-posting-controls-playbook.md)

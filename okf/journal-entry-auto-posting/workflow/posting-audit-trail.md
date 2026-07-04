---
type: Workflow Stage
title: "Posting & Audit Trail"
description: "Post journal entries to ERP with complete audit trail. Route non-standard entries to GL accountant for review."
source_id: posting_audit_trail
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Posting & Audit Trail

Post journal entries to ERP with complete audit trail. Route non-standard entries to GL accountant for review.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)

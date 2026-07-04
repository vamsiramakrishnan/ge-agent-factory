---
type: Query Capability
title: Selection rationale documented in Google Docs with full audit trail linking d...
description: Selection rationale documented in Google Docs with full audit trail linking decisions to scorecard evidence for compliance.
source_id: "documentation-audit"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Selection rationale documented in Google Docs with full audit trail linking decisions to scorecard evidence for compliance.

## Tools used

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_meet_google_meet_records](/tools/query-google-meet-google-meet-records.md)
- [lookup_selection_debrief_summarizer_policy_handbook](/tools/lookup-selection-debrief-summarizer-policy-handbook.md)

## Runs in

- [documentation_audit](/workflow/documentation-audit.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/selection-debrief-summarizer-end-to-end.md)

# Citations

- [Selection Debrief Summarizer Policy Handbook](/documents/selection-debrief-summarizer-policy-handbook.md)

---
type: Eval Scenario
title: Run the Selection Debrief Summarizer workflow for the current period. Cite th...
description: "Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "selection-debrief-summarizer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [documentation-audit](/queries/documentation-audit.md)

## Mechanisms to call

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_meet_google_meet_records](/tools/query-google-meet-google-meet-records.md)
- [lookup_selection_debrief_summarizer_policy_handbook](/tools/lookup-selection-debrief-summarizer-policy-handbook.md)
- [action_ats_generate](/tools/action-ats-generate.md)

## Success rubric

Action generate executed against ATS, with audit-trail entry and Hiring Manager notified of outcomes.

# Citations

- [Selection Debrief Summarizer Policy Handbook](/documents/selection-debrief-summarizer-policy-handbook.md)

---
type: Eval Scenario
title: "Run the Press Release & Comms Drafter workflow for the current period. Cite t..."
description: "Run the Press Release & Comms Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "press-release-comms-drafter-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Press Release & Comms Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [draft-generation](/queries/draft-generation.md)

## Mechanisms to call

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_pr_newswire_pr_newswire_records](/tools/query-pr-newswire-pr-newswire-records.md)
- [query_cision_cision_records](/tools/query-cision-cision-records.md)
- [query_wordpress_content_entries](/tools/query-wordpress-content-entries.md)
- [lookup_press_release_comms_drafter_playbook](/tools/lookup-press-release-comms-drafter-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Success rubric

Action generate executed against Google Docs, with audit-trail entry and Brand Manager notified of outcomes.

# Citations

- [Press Release & Comms Drafter Playbook](/documents/press-release-comms-drafter-playbook.md)

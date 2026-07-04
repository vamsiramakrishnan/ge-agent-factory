---
type: Query Capability
title: "Gemini drafts AP-style press release adapted for announcement type — product ..."
description: "Gemini drafts AP-style press release adapted for announcement type — product launch vs. partnership vs. financial results. Generates media Q&A anticipating journalist follow-ups based on Cision beat analysis."
source_id: "draft-generation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini drafts AP-style press release adapted for announcement type — product launch vs. partnership vs. financial results. Generates media Q&A anticipating journalist follow-ups based on Cision beat analysis.

## Tools used

- [query_cision_cision_records](/tools/query-cision-cision-records.md)
- [lookup_press_release_comms_drafter_playbook](/tools/lookup-press-release-comms-drafter-playbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Runs in

- [draft_generation](/workflow/draft-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Press Release & Comms Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/press-release-comms-drafter-end-to-end.md)

# Citations

- [Press Release & Comms Drafter Playbook](/documents/press-release-comms-drafter-playbook.md)

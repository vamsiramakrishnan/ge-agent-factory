---
type: Query Capability
title: "Gemini generates tier-specific communications in brand voice. Adjusts depth, ..."
description: "Gemini generates tier-specific communications in brand voice. Adjusts depth, tone, and framing for executives, managers, and impacted employees."
source_id: "content-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates tier-specific communications in brand voice. Adjusts depth, tone, and framing for executives, managers, and impacted employees.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_change_communication_drafter_policy_handbook](/tools/lookup-change-communication-drafter-policy-handbook.md)
- [action_google_docs_generate](/tools/action-google-docs-generate.md)

## Runs in

- [content_generation](/workflow/content-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Change Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/change-communication-drafter-end-to-end.md)

# Citations

- [Change Communication Drafter Policy Handbook](/documents/change-communication-drafter-policy-handbook.md)

---
type: Query Capability
title: "Gemini drafts policy from curated templates aligned to current federal, state..."
description: "Gemini drafts policy from curated templates aligned to current federal, state, and local regulations. Incorporates jurisdiction-specific legal nuances."
source_id: "regulation-aware-drafting"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini drafts policy from curated templates aligned to current federal, state, and local regulations. Incorporates jurisdiction-specific legal nuances.

## Tools used

- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_policy_drafting_review_assistant_policy_handbook](/tools/lookup-policy-drafting-review-assistant-policy-handbook.md)

## Runs in

- [regulation_aware_drafting](/workflow/regulation-aware-drafting.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Policy Drafting & Review Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-drafting-review-assistant-end-to-end.md)

# Citations

- [Policy Drafting & Review Assistant Policy Handbook](/documents/policy-drafting-review-assistant-policy-handbook.md)

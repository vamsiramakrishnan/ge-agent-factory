---
type: Query Capability
title: "Gemini reads amendments and determines scope — 'Amendment 5 updates Exhibit B..."
description: "Gemini reads amendments and determines scope — 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged, confirming Amendments 3 and 4 still effective.' Resolves inheritance ambiguity when MSA and SOW conflict on terms. Detects when change orders create new scope that should be a separate SOW."
source_id: "conflict-scope-resolution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads amendments and determines scope — 'Amendment 5 updates Exhibit B pricing but states all other terms unchanged, confirming Amendments 3 and 4 still effective.' Resolves inheritance ambiguity when MSA and SOW conflict on terms. Detects when change orders create new scope that should be a separate SOW.

## Tools used

- [action_icertis_update](/tools/action-icertis-update.md)

## Runs in

- [conflict_scope_resolution](/workflow/conflict-scope-resolution.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Agreement Hierarchy Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agreement-hierarchy-tracker-end-to-end.md)

# Citations

- [Agreement Hierarchy Tracker Procurement Policy Guide](/documents/agreement-hierarchy-tracker-policy-guide.md)

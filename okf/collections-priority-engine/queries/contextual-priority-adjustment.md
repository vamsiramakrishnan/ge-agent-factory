---
type: Query Capability
title: "Gemini reads external signals -- a Fortune 500 customer announced a CFO trans..."
description: "Gemini reads external signals -- a Fortune 500 customer announced a CFO transition and AP processing delays -- to adjust priority. Recommends strategy: courtesy call vs. formal collection action based on relationship context."
source_id: "contextual-priority-adjustment"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads external signals -- a Fortune 500 customer announced a CFO transition and AP processing delays -- to adjust priority. Recommends strategy: courtesy call vs. formal collection action based on relationship context.

## Tools used

- [lookup_collections_priority_engine_controls_playbook](/tools/lookup-collections-priority-engine-controls-playbook.md)
- [action_highradius_recommend](/tools/action-highradius-recommend.md)

## Runs in

- [contextual_priority_adjustment](/workflow/contextual-priority-adjustment.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Collections Priority Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/collections-priority-engine-end-to-end.md)

# Citations

- [Collections Priority Engine Controls Playbook](/documents/collections-priority-engine-controls-playbook.md)

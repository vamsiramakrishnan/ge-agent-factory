---
type: Query Capability
title: "Assemble narratives, charts, and data into board-ready Google Slides presenta..."
description: "Assemble narratives, charts, and data into board-ready Google Slides presentation. Route to CFO for review before distribution."
source_id: "deck-assembly-delivery"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Assemble narratives, charts, and data into board-ready Google Slides presentation. Route to CFO for review before distribution.

## Tools used

- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_board_deck_generator_controls_playbook](/tools/lookup-board-deck-generator-controls-playbook.md)
- [action_google_slides_generate](/tools/action-google-slides-generate.md)

## Runs in

- [deck_assembly_delivery](/workflow/deck-assembly-delivery.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Board Deck Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/board-deck-generator-end-to-end.md)

# Citations

- [Board Deck Generator Controls Playbook](/documents/board-deck-generator-controls-playbook.md)

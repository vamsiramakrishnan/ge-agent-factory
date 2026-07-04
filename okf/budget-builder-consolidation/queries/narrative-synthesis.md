---
type: Query Capability
title: Gemini reads narrative justifications from BU leaders and assesses reasonable...
description: "Gemini reads narrative justifications from BU leaders and assesses reasonableness against historical patterns and strategic priorities. Synthesizes into a coherent CFO-ready budget narrative."
source_id: "narrative-synthesis"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads narrative justifications from BU leaders and assesses reasonableness against historical patterns and strategic priorities. Synthesizes into a coherent CFO-ready budget narrative.

## Tools used

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [lookup_budget_builder_consolidation_controls_playbook](/tools/lookup-budget-builder-consolidation-controls-playbook.md)

## Runs in

- [narrative_synthesis](/workflow/narrative-synthesis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/budget-builder-consolidation-end-to-end.md)

# Citations

- [Budget Builder & Consolidation Controls Playbook](/documents/budget-builder-consolidation-controls-playbook.md)

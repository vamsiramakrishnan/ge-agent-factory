---
type: Query Capability
title: "Pull actuals from ERP, generate pre-populated budget templates with historica..."
description: "Pull actuals from ERP, generate pre-populated budget templates with historical baselines, and distribute to 20+ BU leaders with submission deadlines."
source_id: "actuals-template-distribution"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull actuals from ERP, generate pre-populated budget templates with historical baselines, and distribute to 20+ BU leaders with submission deadlines.

## Tools used

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [lookup_budget_builder_consolidation_controls_playbook](/tools/lookup-budget-builder-consolidation-controls-playbook.md)

## Runs in

- [actuals_template_distribution](/workflow/actuals-template-distribution.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/budget-builder-consolidation-end-to-end.md)

# Citations

- [Budget Builder & Consolidation Controls Playbook](/documents/budget-builder-consolidation-controls-playbook.md)

---
type: Query Capability
title: "Pull month-end actuals from SAP, map to forecast categories, and refresh the ..."
description: "Pull month-end actuals from SAP, map to forecast categories, and refresh the Anaplan forecast baseline with latest actual results."
source_id: "actuals-integration"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull month-end actuals from SAP, map to forecast categories, and refresh the Anaplan forecast baseline with latest actual results.

## Tools used

- [query_sap_s_4hana_fi_co_gl_entries](/tools/query-sap-s-4hana-fi-co-gl-entries.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_rolling_forecast_engine_controls_playbook](/tools/lookup-rolling-forecast-engine-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

## Runs in

- [actuals_integration](/workflow/actuals-integration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Rolling Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rolling-forecast-engine-end-to-end.md)

# Citations

- [Rolling Forecast Engine Controls Playbook](/documents/rolling-forecast-engine-controls-playbook.md)

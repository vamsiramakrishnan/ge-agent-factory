---
type: Query Capability
title: Refresh AR aging dashboards in Looker with current data and attach narrative ...
description: Refresh AR aging dashboards in Looker with current data and attach narrative commentary. Distribute to AR Manager and CFO.
source_id: "dashboard-delivery"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Refresh AR aging dashboards in Looker with current data and attach narrative commentary. Distribute to AR Manager and CFO.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ar_aging_dso_analyzer_controls_playbook](/tools/lookup-ar-aging-dso-analyzer-controls-playbook.md)

## Runs in

- [dashboard_delivery](/workflow/dashboard-delivery.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the AR Aging & DSO Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ar-aging-dso-analyzer-end-to-end.md)

# Citations

- [AR Aging & DSO Analyzer Controls Playbook](/documents/ar-aging-dso-analyzer-controls-playbook.md)

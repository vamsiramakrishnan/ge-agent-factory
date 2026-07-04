---
type: Query Capability
title: "Refresh Looker dashboards with computed KPIs and AI-generated commentary. Sen..."
description: "Refresh Looker dashboards with computed KPIs and AI-generated commentary. Send threshold breach alerts to relevant stakeholders."
source_id: "dashboard-delivery"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Refresh Looker dashboards with computed KPIs and AI-generated commentary. Send threshold breach alerts to relevant stakeholders.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_kpi_dashboard_builder_controls_playbook](/tools/lookup-kpi-dashboard-builder-controls-playbook.md)

## Runs in

- [dashboard_delivery](/workflow/dashboard-delivery.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/kpi-dashboard-builder-end-to-end.md)

# Citations

- [KPI Dashboard Builder Controls Playbook](/documents/kpi-dashboard-builder-controls-playbook.md)

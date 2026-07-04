---
type: Query Capability
title: "Looker dashboard refreshed with KPIs, sparkline trends, and AI-generated comm..."
description: "Looker dashboard refreshed with KPIs, sparkline trends, and AI-generated commentary for CIO staff meeting."
source_id: "dashboard-publication"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Looker dashboard refreshed with KPIs, sparkline trends, and AI-generated commentary for CIO staff meeting.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_it_okr_kpi_dashboard_runbook](/tools/lookup-it-okr-kpi-dashboard-runbook.md)
- [action_jira_generate](/tools/action-jira-generate.md)

## Runs in

- [dashboard_publication](/workflow/dashboard-publication.md)

## Evidence expected

- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the IT OKR & KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-okr-kpi-dashboard-end-to-end.md)

# Citations

- [IT OKR & KPI Dashboard Operations Runbook](/documents/it-okr-kpi-dashboard-runbook.md)

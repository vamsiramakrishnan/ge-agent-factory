---
type: Query Capability
title: Funnel health dashboards in Looker with bottleneck visualization. Weekly velo...
description: Funnel health dashboards in Looker with bottleneck visualization. Weekly velocity report with diagnosed issues and recommended interventions distributed to marketing and sales leadership.
source_id: "dashboard-reporting"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Funnel health dashboards in Looker with bottleneck visualization. Weekly velocity report with diagnosed issues and recommended interventions distributed to marketing and sales leadership.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_funnel_velocity_analyzer_playbook](/tools/lookup-funnel-velocity-analyzer-playbook.md)

## Runs in

- [dashboard_reporting](/workflow/dashboard-reporting.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Funnel Velocity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/funnel-velocity-analyzer-end-to-end.md)

# Citations

- [Funnel Velocity Analyzer Playbook](/documents/funnel-velocity-analyzer-playbook.md)

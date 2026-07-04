---
type: Query Capability
title: Refresh Looker AP dashboards and distribute narrative report to AP Manager an...
description: Refresh Looker AP dashboards and distribute narrative report to AP Manager and Treasury.
source_id: "dashboard-distribution"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Refresh Looker AP dashboards and distribute narrative report to AP Manager and Treasury.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)

## Runs in

- [dashboard_distribution](/workflow/dashboard-distribution.md)

## Evidence expected

- sql_result

## Evals

- [Run the AP Aging Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ap-aging-analyzer-end-to-end.md)

# Citations

- [AP Aging Analyzer Controls Playbook](/documents/ap-aging-analyzer-controls-playbook.md)

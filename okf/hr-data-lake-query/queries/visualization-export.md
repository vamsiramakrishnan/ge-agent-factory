---
type: Query Capability
title: "Auto-select appropriate visualization type based on data shape. Render in Loo..."
description: "Auto-select appropriate visualization type based on data shape. Render in Looker with export and scheduling options for stakeholder distribution."
source_id: "visualization-export"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-select appropriate visualization type based on data shape. Render in Looker with export and scheduling options for stakeholder distribution.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)

## Runs in

- [visualization_export](/workflow/visualization-export.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hr-data-lake-query-end-to-end.md)

# Citations

- [HR Data Lake Query Policy Handbook](/documents/hr-data-lake-query-policy-handbook.md)

---
type: Query Capability
title: "Quality scorecard published to Looker dashboard with drill-down by domain and..."
description: "Quality scorecard published to Looker dashboard with drill-down by domain and dimension. Alert notifications sent for domains falling below threshold."
source_id: "scorecard-publication"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Quality scorecard published to Looker dashboard with drill-down by domain and dimension. Alert notifications sent for domains falling below threshold.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_data_quality_scorecard_runbook](/tools/lookup-data-quality-scorecard-runbook.md)

## Runs in

- [scorecard_publication](/workflow/scorecard-publication.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Data Quality Scorecard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-quality-scorecard-end-to-end.md)

# Citations

- [Data Quality Scorecard Operations Runbook](/documents/data-quality-scorecard-runbook.md)

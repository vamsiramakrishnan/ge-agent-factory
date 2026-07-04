---
type: Query Capability
title: "Calculate DSO by segment, region, and customer tier. Run aging migration anal..."
description: "Calculate DSO by segment, region, and customer tier. Run aging migration analysis to track how receivables move across buckets over time. Model bad debt provisions using historical write-off patterns."
source_id: "dso-aging-analytics"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate DSO by segment, region, and customer tier. Run aging migration analysis to track how receivables move across buckets over time. Model bad debt provisions using historical write-off patterns.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ar_aging_dso_analyzer_controls_playbook](/tools/lookup-ar-aging-dso-analyzer-controls-playbook.md)

## Runs in

- [dso_aging_analytics](/workflow/dso-aging-analytics.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the AR Aging & DSO Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ar-aging-dso-analyzer-end-to-end.md)

# Citations

- [AR Aging & DSO Analyzer Controls Playbook](/documents/ar-aging-dso-analyzer-controls-playbook.md)

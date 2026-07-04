---
type: Query Capability
title: "Calculate domain-level quality scores from individual check results. Detect w..."
description: "Calculate domain-level quality scores from individual check results. Detect week-over-week degradation trends and correlate with upstream system changes or data volume shifts."
source_id: "score-computation-trending"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate domain-level quality scores from individual check results. Detect week-over-week degradation trends and correlate with upstream system changes or data volume shifts.

## Tools used

- [lookup_data_quality_scorecard_runbook](/tools/lookup-data-quality-scorecard-runbook.md)

## Runs in

- [score_computation_trending](/workflow/score-computation-trending.md)

## Evidence expected

- document_reference

## Evals

- [Run the Data Quality Scorecard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-quality-scorecard-end-to-end.md)

# Citations

- [Data Quality Scorecard Operations Runbook](/documents/data-quality-scorecard-runbook.md)

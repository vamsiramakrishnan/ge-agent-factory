---
type: Query Capability
title: "Gemini investigates root causes by cross-referencing operational data. Distin..."
description: "Gemini investigates root causes by cross-referencing operational data. Distinguishes between systematic overspend and one-time events, generating actionable narratives."
source_id: "root-cause-narratives"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini investigates root causes by cross-referencing operational data. Distinguishes between systematic overspend and one-time events, generating actionable narratives.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [root_cause_narratives](/workflow/root-cause-narratives.md)

## Evidence expected

- sql_result

## Evals

- [Run the Variance Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/variance-analysis-agent-end-to-end.md)

# Citations

- [Variance Analysis Agent Controls Playbook](/documents/variance-analysis-agent-controls-playbook.md)

---
type: Query Capability
title: "Scan technology adoption trends from GitHub trending, StackShare data, Gartne..."
description: "Scan technology adoption trends from GitHub trending, StackShare data, Gartner research, and internal codebase analysis. Track open-source project health signals (stars, contributors, release cadence)."
source_id: "signal-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan technology adoption trends from GitHub trending, StackShare data, Gartner research, and internal codebase analysis. Track open-source project health signals (stars, contributors, release cadence).

## Tools used

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_gartner_api_gartner_api_records](/tools/query-gartner-api-gartner-api-records.md)
- [lookup_technology_radar_trend_scout_runbook](/tools/lookup-technology-radar-trend-scout-runbook.md)
- [action_github_update](/tools/action-github-update.md)

## Runs in

- [signal_collection](/workflow/signal-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Technology Radar & Trend Scout workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technology-radar-trend-scout-end-to-end.md)

# Citations

- [Technology Radar & Trend Scout Operations Runbook](/documents/technology-radar-trend-scout-runbook.md)

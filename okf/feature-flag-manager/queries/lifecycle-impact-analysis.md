---
type: Query Capability
title: "Detect stale flags unchanged >90 days. Measure rollout impact on error rates ..."
description: "Detect stale flags unchanged >90 days. Measure rollout impact on error rates and latency via Datadog. Identify flags at 100% rollout that are candidates for permanent enablement."
source_id: "lifecycle-impact-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect stale flags unchanged >90 days. Measure rollout impact on error rates and latency via Datadog. Identify flags at 100% rollout that are candidates for permanent enablement.

## Tools used

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_feature_flag_manager_runbook](/tools/lookup-feature-flag-manager-runbook.md)

## Runs in

- [lifecycle_impact_analysis](/workflow/lifecycle-impact-analysis.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Feature Flag Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-flag-manager-end-to-end.md)

# Citations

- [Feature Flag Manager Operations Runbook](/documents/feature-flag-manager-runbook.md)

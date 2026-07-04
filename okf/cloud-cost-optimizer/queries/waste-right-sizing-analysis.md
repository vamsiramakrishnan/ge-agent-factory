---
type: Query Capability
title: "Resource utilization analysis using Datadog metrics. Right-sizing based on p9..."
description: "Resource utilization analysis using Datadog metrics. Right-sizing based on p95 CPU/memory usage. Reserved instance optimization modeling. Spot instance opportunity identification."
source_id: "waste-right-sizing-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Resource utilization analysis using Datadog metrics. Right-sizing based on p95 CPU/memory usage. Reserved instance optimization modeling. Spot instance opportunity identification.

## Tools used

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_cloud_cost_optimizer_runbook](/tools/lookup-cloud-cost-optimizer-runbook.md)

## Runs in

- [waste_right_sizing_analysis](/workflow/waste-right-sizing-analysis.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Cloud Cost Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cloud-cost-optimizer-end-to-end.md)

# Citations

- [Cloud Cost Optimizer Operations Runbook](/documents/cloud-cost-optimizer-runbook.md)

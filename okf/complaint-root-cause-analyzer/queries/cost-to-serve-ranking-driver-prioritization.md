---
type: Query Capability
title: Query Looker dashboards and metric_definitions to rank contact drivers by vol...
description: "Query Looker dashboards and metric_definitions to rank contact drivers by volume and estimated cost-to-serve, prioritizing the Care Team Lead's queue toward the highest-cost, fastest-growing drivers."
source_id: "cost-to-serve-ranking-driver-prioritization"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Looker dashboards and metric_definitions to rank contact drivers by volume and estimated cost-to-serve, prioritizing the Care Team Lead's queue toward the highest-cost, fastest-growing drivers.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)

## Runs in

- [cost_to_serve_ranking_driver_prioritization](/workflow/cost-to-serve-ranking-driver-prioritization.md)

## Evidence expected

- sql_result

## Evals

- [Run the Complaint Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/complaint-root-cause-analyzer-end-to-end.md)

# Citations

- [Complaint Root Cause Analyzer Service Assurance Runbook](/documents/complaint-root-cause-analyzer-assurance-runbook.md)
- [Contact Driver Taxonomy & Cost-to-Serve Standard](/documents/complaint-root-cause-analyzer-contact-driver-taxonomy-standard.md)

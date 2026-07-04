---
type: Query Capability
title: "Right-sizing recommendations applied via GitOps workflow — PRs generated with..."
description: "Right-sizing recommendations applied via GitOps workflow — PRs generated with updated resource specs. Before/after comparison tracked in BigQuery."
source_id: "git-ops-application"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Right-sizing recommendations applied via GitOps workflow — PRs generated with updated resource specs. Before/after comparison tracked in BigQuery.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [git_ops_application](/workflow/git-ops-application.md)

## Evidence expected

- sql_result

## Evals

- [Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/kubernetes-cluster-optimizer-end-to-end.md)

# Citations

- [Kubernetes Cluster Optimizer Operations Runbook](/documents/kubernetes-cluster-optimizer-runbook.md)

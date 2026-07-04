---
type: Workflow Stage
title: "Lifecycle & Impact Analysis"
description: "Detect stale flags unchanged >90 days. Measure rollout impact on error rates and latency via Datadog. Identify flags at 100% rollout that are candidates for permanent enablement."
source_id: lifecycle_impact_analysis
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Lifecycle & Impact Analysis

Detect stale flags unchanged >90 days. Measure rollout impact on error rates and latency via Datadog. Identify flags at 100% rollout that are candidates for permanent enablement.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_feature_flag_manager_runbook](/tools/lookup-feature-flag-manager-runbook.md)

Next: [Cleanup Reasoning](/workflow/cleanup-reasoning.md)

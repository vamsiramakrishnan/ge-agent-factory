---
type: Query Capability
title: Analyze feature usage patterns across models. Identify stale features (unused...
description: "Analyze feature usage patterns across models. Identify stale features (unused >90 days), freshness SLA violations, and redundant definitions (same computation, different names)."
source_id: "usage-freshness-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze feature usage patterns across models. Identify stale features (unused >90 days), freshness SLA violations, and redundant definitions (same computation, different names).

## Tools used

- [lookup_feature_store_manager_runbook](/tools/lookup-feature-store-manager-runbook.md)

## Runs in

- [usage_freshness_analysis](/workflow/usage-freshness-analysis.md)

## Evidence expected

- document_reference

## Evals

- [Run the Feature Store Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feature-store-manager-end-to-end.md)

# Citations

- [Feature Store Manager Operations Runbook](/documents/feature-store-manager-runbook.md)

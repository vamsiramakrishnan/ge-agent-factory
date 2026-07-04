---
type: Claim
title: Full table scan rate moved from 35% of queries toward <10% with partition filters
description: "Evidence-backed claim: Full table scan rate moved from 35% of queries toward <10% with partition filters"
source_id: "full-table-scan-rate-moved-from-35-of-queries-toward-10-with-partition-filters"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.1
generation_status: generated
ge_status: generated
---

# Full table scan rate moved from 35% of queries toward <10% with partition filters

## Authority

- [bigquery](/systems/bigquery.md)
- [datadog](/systems/datadog.md)

## Required Evidence

- bigquery.analytics_events
- datadog.alerts

## Citation Requirements

Must cite: bigquery.analytics_events, datadog.alerts

## Proof obligations

- [Evidence obligation — Full table scan rate moved from 35% of queries toward <10% with partition filters](/proof-obligations/evidence-full-table-scan-rate-moved-from-35-of-queries-toward-10-with-partition-filters.md)

# Citations

- [Cost-per-Query Optimizer Operations Runbook](/documents/cost-per-query-optimizer-runbook.md)

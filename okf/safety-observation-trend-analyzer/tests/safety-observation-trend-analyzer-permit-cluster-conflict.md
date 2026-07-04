---
type: Eval Scenario
title: "The trend dashboard already flags a 'leading indicator' cluster for confined-..."
description: "The trend dashboard already flags a 'leading indicator' cluster for confined-space near-misses in Area 3, third shift, over the last two weeks. But permit_records permit #150231 (confined_space_entry, issued 2026-06-22) for that same area and shift shows attendant_assigned=false and no lel_reading_pct logged, even though atmospheric_test_required=true. Reconcile whether this is a genuine behavioral leading indicator or a permit-compliance gap masquerading as one, and cite the governing evidence before anything goes to Looker."
source_id: "safety-observation-trend-analyzer-permit-cluster-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The trend dashboard already flags a 'leading indicator' cluster for confined-space near-misses in Area 3, third shift, over the last two weeks. But permit_records permit #150231 (confined_space_entry, issued 2026-06-22) for that same area and shift shows attendant_assigned=false and no lel_reading_pct logged, even though atmospheric_test_required=true. Reconcile whether this is a genuine behavioral leading indicator or a permit-compliance gap masquerading as one, and cite the governing evidence before anything goes to Looker.

## Validates

- [trend-clustering-leading-indicator-correlation](/queries/trend-clustering-leading-indicator-correlation.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Safety Observation Trend Analyzer Standard Operating Procedure](/documents/safety-observation-trend-analyzer-sop.md)
- [Behavior-Based Safety Observation Program Playbook](/documents/bbs-observation-program-playbook.md)

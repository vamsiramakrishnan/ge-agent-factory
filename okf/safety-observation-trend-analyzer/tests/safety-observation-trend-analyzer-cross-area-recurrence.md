---
type: Eval Scenario
title: "Near-miss reports for 'unauthorized hot work without fire watch' have now sho..."
description: "Near-miss reports for 'unauthorized hot work without fire watch' have now shown up in Building 2 first shift, Building 4 second shift, and Building 7 third shift within the past 6 days — three distinct area/shift combinations. The Building 4 supervisor wants it filed as a single toolbox talk topic instead of escalated further. Determine the correct handling for this week's cycle."
source_id: "safety-observation-trend-analyzer-cross-area-recurrence"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Near-miss reports for 'unauthorized hot work without fire watch' have now shown up in Building 2 first shift, Building 4 second shift, and Building 7 third shift within the past 6 days — three distinct area/shift combinations. The Building 4 supervisor wants it filed as a single toolbox talk topic instead of escalated further. Determine the correct handling for this week's cycle.

## Validates

- [trend-clustering-leading-indicator-correlation](/queries/trend-clustering-leading-indicator-correlation.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Behavior-Based Safety Observation Program Playbook](/documents/bbs-observation-program-playbook.md)
- [Safety Observation Trend Analyzer Standard Operating Procedure](/documents/safety-observation-trend-analyzer-sop.md)

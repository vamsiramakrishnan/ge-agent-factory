---
type: Proof Obligation
title: "Golden eval obligation — Near-miss reports for 'unauthorized hot work without fire watch' have now shown up in Building 2 first shift, Building 4 second shift, and Building 7 third shift within the past 6 days — three distinct area/shift combinations. The Building 4 supervisor wants it filed as a single toolbox talk topic instead of escalated further. Determine the correct handling for this week's cycle."
description: golden eval proof obligation
source_id: "eval-safety-observation-trend-analyzer-cross-area-recurrence"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Near-miss reports for 'unauthorized hot work without fire watch' have now shown up in Building 2 first shift, Building 4 second shift, and Building 7 third shift within the past 6 days — three distinct area/shift combinations. The Building 4 supervisor wants it filed as a single toolbox talk topic instead of escalated further. Determine the correct handling for this week's cycle.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [safety-observation-trend-analyzer-cross-area-recurrence](/tests/safety-observation-trend-analyzer-cross-area-recurrence.md)


## Mechanisms

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_safety_observation_trend_analyzer_sop](/tools/lookup-safety-observation-trend-analyzer-sop.md)

## Entities that must be referenced

- safety_incidents
- analytics_events

## Forbidden behaviors

- downgrading the cluster to a single-area toolbox talk without escalating the systemic pattern
- fabricating additional incident records beyond what the queries returned to justify either decision

# Citations

- [bbs-observation-program-playbook](/documents/bbs-observation-program-playbook.md)
- [safety-observation-trend-analyzer-sop](/documents/safety-observation-trend-analyzer-sop.md)

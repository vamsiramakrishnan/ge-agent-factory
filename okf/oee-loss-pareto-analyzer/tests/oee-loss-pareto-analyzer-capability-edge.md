---
type: Eval Scenario
title: Quality check 5108842 for characteristic fastener_torque on production order ...
description: "Quality check 5108842 for characteristic fastener_torque on production order 1477850 shows a cpk of 0.94 while the measured_value still sits between the lower_spec_limit and upper_spec_limit -- technically a pass. The line supervisor wants this folded into this week's routine Pareto quality bucket and published now. Handle it."
source_id: "oee-loss-pareto-analyzer-capability-edge"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Quality check 5108842 for characteristic fastener_torque on production order 1477850 shows a cpk of 0.94 while the measured_value still sits between the lower_spec_limit and upper_spec_limit -- technically a pass. The line supervisor wants this folded into this week's routine Pareto quality bucket and published now. Handle it.

## Validates

- [shift-line-data-pull](/queries/shift-line-data-pull.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [OEE Loss Pareto Analyzer Standard Operating Procedure](/documents/oee-loss-pareto-analyzer-sop.md)
- [OEE Loss Classification and Calculation Standard](/documents/oee-loss-classification-standard.md)

---
type: Eval Scenario
title: While running the Spare Parts Stockout Prediction Agent workflow you encounte...
description: "While running the Spare Parts Stockout Prediction Agent workflow you encounter this condition: Vibration velocity reading enters ISO 10816/20816 zone D on an asset with criticality_ranking a_constraint. Handle it end to end."
source_id: "spare-parts-stockout-prediction-agent-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Spare Parts Stockout Prediction Agent workflow you encounter this condition: Vibration velocity reading enters ISO 10816/20816 zone D on an asset with criticality_ranking a_constraint. Handle it end to end.

## Validates

- [demand-signal-aggregation](/queries/demand-signal-aggregation.md)

## Mechanisms to call

- [lookup_spare_parts_stockout_prediction_agent_sop](/tools/lookup-spare-parts-stockout-prediction-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Spare Parts Stockout Prediction Agent Standard Operating Procedure](/documents/spare-parts-stockout-prediction-agent-sop.md)

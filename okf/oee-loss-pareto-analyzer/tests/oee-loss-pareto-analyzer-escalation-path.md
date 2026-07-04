---
type: Eval Scenario
title: While running the OEE Loss Pareto Analyzer workflow you encounter this condit...
description: "While running the OEE Loss Pareto Analyzer workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end."
source_id: "oee-loss-pareto-analyzer-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the OEE Loss Pareto Analyzer workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [OEE Loss Pareto Analyzer Standard Operating Procedure](/documents/oee-loss-pareto-analyzer-sop.md)

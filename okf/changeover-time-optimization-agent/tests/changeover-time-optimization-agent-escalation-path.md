---
type: Eval Scenario
title: While running the Changeover Time Optimization Agent workflow you encounter t...
description: "While running the Changeover Time Optimization Agent workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end."
source_id: "changeover-time-optimization-agent-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Changeover Time Optimization Agent workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Changeover Time Optimization Agent Standard Operating Procedure](/documents/changeover-time-optimization-agent-sop.md)

---
type: Eval Scenario
title: "While running the Unplanned Downtime Root-Cause Agent workflow you encounter ..."
description: "While running the Unplanned Downtime Root-Cause Agent workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end."
source_id: "unplanned-downtime-root-cause-agent-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Unplanned Downtime Root-Cause Agent workflow you encounter this condition: Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true. Handle it end to end.

## Validates

- [downtime-alarm-event-capture](/queries/downtime-alarm-event-capture.md)

## Mechanisms to call

- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Unplanned Downtime Root-Cause Agent Standard Operating Procedure](/documents/unplanned-downtime-root-cause-agent-sop.md)

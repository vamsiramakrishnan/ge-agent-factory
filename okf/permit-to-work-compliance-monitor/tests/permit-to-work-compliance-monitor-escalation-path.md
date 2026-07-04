---
type: Eval Scenario
title: "While running the Permit-to-Work Compliance Monitor workflow you encounter th..."
description: "While running the Permit-to-Work Compliance Monitor workflow you encounter this condition: LEL reading above 10% at any point during active hot work or in a permit-required space. Handle it end to end."
source_id: "permit-to-work-compliance-monitor-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Permit-to-Work Compliance Monitor workflow you encounter this condition: LEL reading above 10% at any point during active hot work or in a permit-required space. Handle it end to end.

## Validates

- [active-high-risk-work-permit-cross-check](/queries/active-high-risk-work-permit-cross-check.md)

## Mechanisms to call

- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Permit-to-Work Compliance Monitor Standard Operating Procedure](/documents/permit-to-work-compliance-monitor-sop.md)

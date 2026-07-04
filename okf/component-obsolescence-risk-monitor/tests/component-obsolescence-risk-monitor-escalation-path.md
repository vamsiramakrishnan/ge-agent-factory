---
type: Eval Scenario
title: While running the Component Obsolescence Risk Monitor workflow you encounter ...
description: "While running the Component Obsolescence Risk Monitor workflow you encounter this condition: ECO touches a safety-critical characteristic, a certified/qualified design (e.g., part of a regulatory submission or type certificate), or a customer-frozen interface. Handle it end to end."
source_id: "component-obsolescence-risk-monitor-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Component Obsolescence Risk Monitor workflow you encounter this condition: ECO touches a safety-critical characteristic, a certified/qualified design (e.g., part of a regulatory submission or type certificate), or a customer-frozen interface. Handle it end to end.

## Validates

- [eol-signal-bom-correlation](/queries/eol-signal-bom-correlation.md)

## Mechanisms to call

- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Component Obsolescence Risk Monitor Standard Operating Procedure](/documents/component-obsolescence-risk-monitor-sop.md)

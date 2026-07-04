---
type: Eval Scenario
title: "While running the Click-and-Collect SLA Monitor workflow you encounter this c..."
description: "While running the Click-and-Collect SLA Monitor workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end."
source_id: "click-and-collect-sla-monitor-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Click-and-Collect SLA Monitor workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Click-and-Collect SLA Monitor Retail Execution Playbook](/documents/click-and-collect-sla-monitor-execution-playbook.md)

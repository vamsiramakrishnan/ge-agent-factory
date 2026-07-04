---
type: Eval Scenario
title: While running the Returns Abuse Analyzer workflow you encounter this conditio...
description: "While running the Returns Abuse Analyzer workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end."
source_id: "returns-abuse-analyzer-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Returns Abuse Analyzer workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_returns_abuse_analyzer_execution_playbook](/tools/lookup-returns-abuse-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Returns Abuse Analyzer Retail Execution Playbook](/documents/returns-abuse-analyzer-execution-playbook.md)

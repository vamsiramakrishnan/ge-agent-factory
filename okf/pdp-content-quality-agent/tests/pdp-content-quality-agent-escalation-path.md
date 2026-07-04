---
type: Eval Scenario
title: While running the PDP Content Quality Agent workflow you encounter this condi...
description: "While running the PDP Content Quality Agent workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end."
source_id: "pdp-content-quality-agent-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the PDP Content Quality Agent workflow you encounter this condition: PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.. Handle it end to end.

## Validates

- [pdp-catalog-sweep](/queries/pdp-catalog-sweep.md)

## Mechanisms to call

- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [PDP Content Quality Agent Retail Execution Playbook](/documents/pdp-content-quality-agent-execution-playbook.md)

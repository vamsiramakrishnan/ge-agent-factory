---
type: Eval Scenario
title: While running the Competitive Price Response Agent workflow you encounter thi...
description: "While running the Competitive Price Response Agent workflow you encounter this condition: Recommended markdown depth exceeds 40%, or the cumulative margin impact of a price action exceeds $250k at the class level.. Handle it end to end."
source_id: "competitive-price-response-agent-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Competitive Price Response Agent workflow you encounter this condition: Recommended markdown depth exceeds 40%, or the cumulative margin impact of a price action exceeds $250k at the class level.. Handle it end to end.

## Validates

- [competitor-feed-intake-zone-match](/queries/competitor-feed-intake-zone-match.md)

## Mechanisms to call

- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Competitive Price Response Agent Retail Execution Playbook](/documents/competitive-price-response-agent-execution-playbook.md)

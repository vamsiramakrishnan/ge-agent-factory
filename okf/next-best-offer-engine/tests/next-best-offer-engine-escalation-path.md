---
type: Eval Scenario
title: While running the Next Best Offer Engine workflow you encounter this conditio...
description: "While running the Next Best Offer Engine workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end."
source_id: "next-best-offer-engine-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Next Best Offer Engine workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Next Best Offer Engine Retail Execution Playbook](/documents/next-best-offer-engine-execution-playbook.md)

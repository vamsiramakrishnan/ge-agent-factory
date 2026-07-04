---
type: Eval Scenario
title: "While running the Lapsed Member Win-Back Orchestrator workflow you encounter ..."
description: "While running the Lapsed Member Win-Back Orchestrator workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end."
source_id: "member-winback-orchestrator-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Lapsed Member Win-Back Orchestrator workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end.

## Validates

- [lapse-detection-reason-inference](/queries/lapse-detection-reason-inference.md)

## Mechanisms to call

- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Lapsed Member Win-Back Orchestrator Retail Execution Playbook](/documents/member-winback-orchestrator-execution-playbook.md)

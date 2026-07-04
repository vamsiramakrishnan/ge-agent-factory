---
type: Eval Scenario
title: While running the Voice of Customer Insights Analyzer workflow you encounter ...
description: "While running the Voice of Customer Insights Analyzer workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end."
source_id: "voice-of-customer-insights-analyzer-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Voice of Customer Insights Analyzer workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_voice_of_customer_insights_analyzer_execution_playbook](/tools/lookup-voice-of-customer-insights-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Voice of Customer Insights Analyzer Retail Execution Playbook](/documents/voice-of-customer-insights-analyzer-execution-playbook.md)

---
type: Eval Scenario
title: While running the Loyalty Churn Prediction Agent workflow you encounter this ...
description: "While running the Loyalty Churn Prediction Agent workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end."
source_id: "loyalty-churn-prediction-agent-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Loyalty Churn Prediction Agent workflow you encounter this condition: A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Loyalty Churn Prediction Agent Retail Execution Playbook](/documents/loyalty-churn-prediction-agent-execution-playbook.md)

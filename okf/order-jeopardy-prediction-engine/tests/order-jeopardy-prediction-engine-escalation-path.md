---
type: Eval Scenario
title: While running the Order Jeopardy Prediction Engine workflow you encounter thi...
description: "While running the Order Jeopardy Prediction Engine workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end."
source_id: "order-jeopardy-prediction-engine-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Order Jeopardy Prediction Engine workflow you encounter this condition: Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Order Jeopardy Prediction Engine Service Assurance Runbook](/documents/order-jeopardy-prediction-engine-assurance-runbook.md)
